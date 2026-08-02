from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
db = client.family_tree_db
collection = db.tree_data

# Data Models
class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]
    draggable: Optional[bool] = None
    width: Optional[float] = None
    height: Optional[float] = None
    selected: Optional[bool] = None
    dragging: Optional[bool] = None

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None
    type: Optional[str] = None
    style: Optional[Dict[str, Any]] = None
    animated: Optional[bool] = None

class TreeData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

# Global fallback flag
USE_MONGO = True
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_FILE = os.path.join(BASE_DIR, "tree_data.json")
import json

@app.on_event("startup")
async def startup_db_client():
    global USE_MONGO
    try:
        # Ping the database to check connection with a short timeout
        await client.admin.command('ping')
        print("Connected to MongoDB!")
        USE_MONGO = True
    except Exception as e:
        print(f"Could not connect to MongoDB: {e}")
        print("Falling back to local JSON file storage.")
        USE_MONGO = False

@app.on_event("shutdown")
async def shutdown_db_client():
    if USE_MONGO:
        client.close()

@app.get("/api/tree", response_model=TreeData)
async def get_tree():
    if USE_MONGO:
        try:
            doc = await collection.find_one({"_id": "main_tree"})
            if doc:
                return TreeData(nodes=doc['nodes'], edges=doc['edges'])
        except Exception as e:
             print(f"Mongo read error: {e}")
             # Fallthrough to empty
    else:
        # File Fallback
        if os.path.exists(JSON_FILE):
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
                    return TreeData(**data)
            except Exception as e:
                print(f"File read error: {e}")
    
    # Default empty
    return TreeData(nodes=[], edges=[])

@app.post("/api/tree")
async def save_tree(tree_data: TreeData):
    save_result = {"status": "success", "mode": "unknown"}
    
    # 1. Save to MongoDB (Primary)
    if USE_MONGO:
        try:
            doc = tree_data.model_dump()
            doc["_id"] = "main_tree"
            await collection.replace_one({"_id": "main_tree"}, doc, upsert=True)
            save_result["mode"] = "mongo"
        except Exception as e:
            print(f"Mongo save error: {e}")
            # Don't return, try file save as fallback/sync

    # 2. Save to JSON File (Backup/Sync)
    try:
        with open(JSON_FILE, "w") as f:
            json.dump(tree_data.model_dump(), f, indent=2)
        if save_result["mode"] == "unknown":
             save_result["mode"] = "file"
    except Exception as e:
        print(f"File save error: {e}")
        if save_result["mode"] == "unknown":
             raise HTTPException(status_code=500, detail=str(e))

    # Removed sync to initialData.js as requested
    return save_result

@app.get("/")
async def root():
    return {"message": "Family Tree API is running"}
