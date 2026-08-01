import unittest
import json
import os

class TestFamilyTreeLayout(unittest.TestCase):
    def setUp(self):
        json_path = os.path.join(os.path.dirname(__file__), "tree_data.json")
        with open(json_path, "r") as f:
            self.data = json.load(f)
        self.nodes = self.data["nodes"]
        self.edges = self.data["edges"]

    def test_total_nodes_count(self):
        self.assertGreater(len(self.nodes), 150)

    def test_serena_sood_name(self):
        sanaya = next((n for n in self.nodes if n["id"] == "sanaya_sood"), None)
        self.assertIsNotNone(sanaya)
        self.assertEqual(sanaya["data"]["name"], "Serena Sood")

    def test_pet_names(self):
        virendra = next((n for n in self.nodes if n["id"] == "virendra"), None)
        jatinder = next((n for n in self.nodes if n["id"] == "jatinder"), None)
        ravinder = next((n for n in self.nodes if n["id"] == "ravinder"), None)

        self.assertEqual(virendra["data"].get("petName"), "Guddu")
        self.assertEqual(jatinder["data"].get("petName"), "Jiti")
        self.assertEqual(ravinder["data"].get("petName"), "Ram / Ramu")

    def test_850px_generation_vertical_spacing(self):
        person_ys = sorted(list(set(n["position"]["y"] for n in self.nodes if n["type"] == "person")))
        self.assertGreaterEqual(len(person_ys), 7)
        for i in range(1, len(person_ys)):
            gap = person_ys[i] - person_ys[i - 1]
            self.assertEqual(gap, 850.0)

    def test_marriage_node_y_offsets(self):
        node_map = {n["id"]: n for n in self.nodes}
        for n in self.nodes:
            if n["type"] == "marriage":
                m_id = n["id"]
                spouse_edges = [e for e in self.edges if (e["source"] == m_id or e["target"] == m_id) and (e.get("sourceHandle") in ["left", "right"] or e.get("targetHandle") in ["left", "right"])]
                for e in spouse_edges:
                    person_id = e["source"] if e["source"] != m_id else e["target"]
                    person = node_map.get(person_id)
                    if person and person["type"] == "person":
                        self.assertEqual(n["position"]["y"], person["position"]["y"] + 30.0)

if __name__ == "__main__":
    unittest.main()
