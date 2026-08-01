import json

# CONSTANTS FOR LAYOUT POSITIONING
NODE_WIDTH = 160
SPOUSE_GAP_X = 280
Y_SPACING = 850
MARRIAGE_Y_OFFSET = 30

def get_marriage_x(husband_x):
    return (2 * husband_x + NODE_WIDTH + SPOUSE_GAP_X) / 2

def create_person(id, start_x, start_y, name, gender, birth_year=None, death_year=None, photo=None, pet_name=None):
    return {
        "id": id,
        "type": "person",
        "position": {"x": start_x, "y": start_y},
        "data": {
            "name": name,
            "gender": gender,
            "birthYear": str(birth_year) if birth_year else None,
            "deathYear": str(death_year) if death_year else None,
            "photo": photo,
            "petName": pet_name
        }
    }

def create_marriage(id, x, y):
    return {
        "id": id,
        "type": "marriage",
        "position": {"x": x, "y": y},
        "data": {}
    }

def create_edge(source, target, sourceHandle=None, targetHandle=None, type="smoothstep"):
    style = {
        "stroke": "#8b5cf6",
        "strokeWidth": 2,
        "filter": "drop-shadow(0 1px 2px rgba(139, 92, 246, 0.5))"
    }
    if type == "straight":
        style = { "stroke": "#ef4444", "strokeWidth": 3 }
    
    return {
        "id": f"e-{source}-{target}",
        "source": source,
        "target": target,
        "sourceHandle": sourceHandle,
        "targetHandle": targetHandle,
        "type": type,
        "style": style
    }

nodes = []
edges = []

# ==========================================
# GENERATION 0 (Apex Ancestor)
# ==========================================
nodes.append(create_person("ram_kishan_sood", 0, -Y_SPACING, "Ram Kishan Sood", "male"))

# ==========================================
# GENERATION 1
# ==========================================
# Roda Mal Sood Branch (Right)
nodes.append(create_person("roda", 2000, 0, "Roda Mal Sood", "male"))
edges.append(create_edge("ram_kishan_sood", "roda", "bottom", "top"))

# Bhoda Mal Sood Branch (Left)
nodes.append(create_person("bhoda_mal_sood", -6000, 0, "Bhoda Mal Sood", "male"))
edges.append(create_edge("ram_kishan_sood", "bhoda_mal_sood", "bottom", "top"))


# ==========================================
# GENERATION 2
# ==========================================
GEN2_Y = Y_SPACING

# --- Roda Mal Line ---
nodes.append(create_person("khushal", 2000, GEN2_Y, "Khushal Chand Sood", "male", "1800s"))
edges.append(create_edge("roda", "khushal", "bottom", "top"))

nodes.append(create_person("jwala", 2000 + SPOUSE_GAP_X, GEN2_Y, "Jwala Devi Sood", "female"))
mx_khushal = get_marriage_x(2000)
nodes.append(create_marriage("m_khushal_jwala", mx_khushal, GEN2_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("khushal", "m_khushal_jwala", "right", "left", "straight"))
edges.append(create_edge("m_khushal_jwala", "jwala", "right", "left", "straight"))

# --- Bhoda Mal Line ---
# 1. Lajpat Rai Sood
start_lajpat = -8000
nodes.append(create_person("lajpat_rai_sood", start_lajpat, GEN2_Y, "Lajpat Rai Sood", "male"))
edges.append(create_edge("bhoda_mal_sood", "lajpat_rai_sood", "bottom", "top"))

nodes.append(create_person("dhandevi_sood", start_lajpat + SPOUSE_GAP_X, GEN2_Y, "Dhandevi Sood", "female"))
mx_lajpat = get_marriage_x(start_lajpat)
nodes.append(create_marriage("m_lajpat_dhandevi", mx_lajpat, GEN2_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("lajpat_rai_sood", "m_lajpat_dhandevi", "right", "left", "straight"))
edges.append(create_edge("m_lajpat_dhandevi", "dhandevi_sood", "right", "left", "straight"))

# 2. Mela Ram Sood
start_melaram = -4000
nodes.append(create_person("mela_ram_sood", start_melaram, GEN2_Y, "Mela Ram Sood", "male"))
edges.append(create_edge("bhoda_mal_sood", "mela_ram_sood", "bottom", "top"))


# ==========================================
# GENERATION 3
# ==========================================
GEN3_Y = Y_SPACING * 2

# --- Roda -> Khushal Line ---
# Charandas
nodes.append(create_person("charandas", -2000, GEN3_Y, "Charandas Sood", "male"))
edges.append(create_edge("m_khushal_jwala", "charandas", "bottom", "top"))

# Gauri Shankar
nodes.append(create_person("gauri", 4000, GEN3_Y, "Gauri Shankar Sood", "male", "1800s"))
edges.append(create_edge("m_khushal_jwala", "gauri", "bottom", "top"))

nodes.append(create_person("kaushalya", 4000 + SPOUSE_GAP_X, GEN3_Y, "Kaushalya Devi", "female"))
mx_gauri = get_marriage_x(4000)
nodes.append(create_marriage("m_gauri_kaushalya", mx_gauri, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("gauri", "m_gauri_kaushalya", "right", "left", "straight"))
edges.append(create_edge("m_gauri_kaushalya", "kaushalya", "right", "left", "straight"))

# --- Lajpat Rai & Dhandevi Line ---
# 1. Jaswant Rai Sood
start_jaswant = -11000
nodes.append(create_person("jaswant_rai_sood", start_jaswant, GEN3_Y, "Jaswant Rai Sood", "male"))
edges.append(create_edge("m_lajpat_dhandevi", "jaswant_rai_sood", "bottom", "top"))

nodes.append(create_person("sarla_sood_jaswant", start_jaswant + SPOUSE_GAP_X, GEN3_Y, "Sarla Sood", "female"))
mx_jaswant = get_marriage_x(start_jaswant)
nodes.append(create_marriage("m_jaswant_sarla", mx_jaswant, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("jaswant_rai_sood", "m_jaswant_sarla", "right", "left", "straight"))
edges.append(create_edge("m_jaswant_sarla", "sarla_sood_jaswant", "right", "left", "straight"))

# 2. Satpal Sood
start_satpal = -9500
nodes.append(create_person("satpal_sood", start_satpal, GEN3_Y, "Satpal Sood", "male"))
edges.append(create_edge("m_lajpat_dhandevi", "satpal_sood", "bottom", "top"))

nodes.append(create_person("prem_sood", start_satpal + SPOUSE_GAP_X, GEN3_Y, "Prem Sood", "female"))
mx_satpal = get_marriage_x(start_satpal)
nodes.append(create_marriage("m_satpal_prem", mx_satpal, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("satpal_sood", "m_satpal_prem", "right", "left", "straight"))
edges.append(create_edge("m_satpal_prem", "prem_sood", "right", "left", "straight"))

# 3. Yashpal Sood
nodes.append(create_person("yashpal_sood", -8200, GEN3_Y, "Yashpal Sood", "male"))
edges.append(create_edge("m_lajpat_dhandevi", "yashpal_sood", "bottom", "top"))

# 4. Savitri Sood (Mahindra)
start_savitri_m = -7600
nodes.append(create_person("savitri_sood_mahindra", start_savitri_m, GEN3_Y, "Savitri Sood", "female"))
edges.append(create_edge("m_lajpat_dhandevi", "savitri_sood_mahindra", "bottom", "top"))

nodes.append(create_person("rl_mahindra", start_savitri_m + SPOUSE_GAP_X, GEN3_Y, "R.L. Mahindra", "male"))
mx_savitri_m = get_marriage_x(start_savitri_m)
nodes.append(create_marriage("m_savitri_rl_mahindra", mx_savitri_m, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("savitri_sood_mahindra", "m_savitri_rl_mahindra", "right", "left", "straight"))
edges.append(create_edge("m_savitri_rl_mahindra", "rl_mahindra", "right", "left", "straight"))

# 5. Sundar Lata Sood (Kapoor)
start_sundar = -6200
nodes.append(create_person("sundar_lata_sood_kapoor", start_sundar, GEN3_Y, "Sundar Lata Sood", "female"))
edges.append(create_edge("m_lajpat_dhandevi", "sundar_lata_sood_kapoor", "bottom", "top"))

nodes.append(create_person("kapoor_spouse", start_sundar + SPOUSE_GAP_X, GEN3_Y, "Kapoor", "male"))
mx_sundar = get_marriage_x(start_sundar)
nodes.append(create_marriage("m_sundar_kapoor", mx_sundar, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("sundar_lata_sood_kapoor", "m_sundar_kapoor", "right", "left", "straight"))
edges.append(create_edge("m_sundar_kapoor", "kapoor_spouse", "right", "left", "straight"))

# 6. Ved Lata Sood
start_ved = -5000
nodes.append(create_person("ved_lata_sood", start_ved, GEN3_Y, "Ved Lata Sood", "female"))
edges.append(create_edge("m_lajpat_dhandevi", "ved_lata_sood", "bottom", "top"))

nodes.append(create_person("yashpal_sood_husband_of_ved_lata", start_ved + SPOUSE_GAP_X, GEN3_Y, "Yashpal Sood", "male"))
mx_ved = get_marriage_x(start_ved)
nodes.append(create_marriage("m_ved_yashpal", mx_ved, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("ved_lata_sood", "m_ved_yashpal", "right", "left", "straight"))
edges.append(create_edge("m_ved_yashpal", "yashpal_sood_husband_of_ved_lata", "right", "left", "straight"))

# --- Mela Ram Sood Line ---
nodes.append(create_person("aruna_sood", -4400, GEN3_Y, "Aruna Sood", "female"))
edges.append(create_edge("mela_ram_sood", "aruna_sood", "bottom", "top"))

nodes.append(create_person("renu_sood", -4100, GEN3_Y, "Renu Sood", "female"))
edges.append(create_edge("mela_ram_sood", "renu_sood", "bottom", "top"))

nodes.append(create_person("saroj_sood_melaram", -3800, GEN3_Y, "Saroj Sood", "female"))
edges.append(create_edge("mela_ram_sood", "saroj_sood_melaram", "bottom", "top"))

start_devinder = -3400
nodes.append(create_person("devinder_sood", start_devinder, GEN3_Y, "Devinder Sood", "male"))
edges.append(create_edge("mela_ram_sood", "devinder_sood", "bottom", "top"))

nodes.append(create_person("rabinder_sood", start_devinder + SPOUSE_GAP_X, GEN3_Y, "Rabinder Sood", "female"))
mx_devinder = get_marriage_x(start_devinder)
nodes.append(create_marriage("m_devinder_rabinder", mx_devinder, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("devinder_sood", "m_devinder_rabinder", "right", "left", "straight"))
edges.append(create_edge("m_devinder_rabinder", "rabinder_sood", "right", "left", "straight"))

start_rajendra_k = -2600
nodes.append(create_person("rajendra_kashyap", start_rajendra_k, GEN3_Y, "Rajendra Kashyap", "male"))
edges.append(create_edge("mela_ram_sood", "rajendra_kashyap", "bottom", "top"))

nodes.append(create_person("neelam_kashyap", start_rajendra_k + SPOUSE_GAP_X, GEN3_Y, "Neelam", "female"))
mx_rajendra_k = get_marriage_x(start_rajendra_k)
nodes.append(create_marriage("m_rajendra_neelam_k", mx_rajendra_k, GEN3_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("rajendra_kashyap", "m_rajendra_neelam_k", "right", "left", "straight"))
edges.append(create_edge("m_rajendra_neelam_k", "neelam_kashyap", "right", "left", "straight"))


# ==========================================
# GENERATION 4
# ==========================================
GEN4_Y = Y_SPACING * 3

# Child of Charandas
nodes.append(create_person("mahindra", -2000, GEN4_Y, "Mahindra Pratap Sood", "male"))
edges.append(create_edge("charandas", "mahindra", "bottom", "top"))

# Children of Jaswant Rai & Sarla
nodes.append(create_person("brij_mohan_sood", -11300, GEN4_Y, "Brij Mohan Sood", "male"))
edges.append(create_edge("m_jaswant_sarla", "brij_mohan_sood", "bottom", "top"))

nodes.append(create_person("sushma_sood", -11000, GEN4_Y, "Sushma Sood", "female"))
edges.append(create_edge("m_jaswant_sarla", "sushma_sood", "bottom", "top"))

nodes.append(create_person("rama_sood", -10700, GEN4_Y, "Rama Sood", "female"))
edges.append(create_edge("m_jaswant_sarla", "rama_sood", "bottom", "top"))

# Children of Satpal & Prem
start_ajay_satpal = -9700
nodes.append(create_person("ajay_sood_satpal", start_ajay_satpal, GEN4_Y, "Ajay Sood", "male"))
edges.append(create_edge("m_satpal_prem", "ajay_sood_satpal", "bottom", "top"))

nodes.append(create_person("jyoti_sood", start_ajay_satpal + SPOUSE_GAP_X, GEN4_Y, "Jyoti Sood", "female"))
mx_ajay_s = get_marriage_x(start_ajay_satpal)
nodes.append(create_marriage("m_ajay_jyoti", mx_ajay_s, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("ajay_sood_satpal", "m_ajay_jyoti", "right", "left", "straight"))
edges.append(create_edge("m_ajay_jyoti", "jyoti_sood", "right", "left", "straight"))

nodes.append(create_person("vinay_sood", -9000, GEN4_Y, "Vinay Sood", "male"))
edges.append(create_edge("m_satpal_prem", "vinay_sood", "bottom", "top"))

# Children of Savitri & R.L. Mahindra
nodes.append(create_person("savita", -8200, GEN4_Y, "Savita Mahindra", "female"))
edges.append(create_edge("m_savitri_rl_mahindra", "savita", "bottom", "top"))

nodes.append(create_person("virinder_mahindra", -7900, GEN4_Y, "Virinder Mahindra", "male"))
edges.append(create_edge("m_savitri_rl_mahindra", "virinder_mahindra", "bottom", "top"))

nodes.append(create_person("surindra_veer_mahindra", -7600, GEN4_Y, "Surindra Veer Mahindra", "male"))
edges.append(create_edge("m_savitri_rl_mahindra", "surindra_veer_mahindra", "bottom", "top"))

nodes.append(create_person("kuki", -7300, GEN4_Y, "Kuki Mahindra", "female"))
edges.append(create_edge("m_savitri_rl_mahindra", "kuki", "bottom", "top"))

start_dharendra = -7000
nodes.append(create_person("dharendra_veer_mahindra", start_dharendra, GEN4_Y, "Dharendra Veer Mahindra", "male"))
edges.append(create_edge("m_savitri_rl_mahindra", "dharendra_veer_mahindra", "bottom", "top"))

nodes.append(create_person("kusum_mahindra", start_dharendra + SPOUSE_GAP_X, GEN4_Y, "Kusum Mahindra", "female"))
mx_dharendra = get_marriage_x(start_dharendra)
nodes.append(create_marriage("m_dharendra_kusum", mx_dharendra, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("dharendra_veer_mahindra", "m_dharendra_kusum", "right", "left", "straight"))
edges.append(create_edge("m_dharendra_kusum", "kusum_mahindra", "right", "left", "straight"))

# Children of Devinder & Rabinder Sood
nodes.append(create_person("unnamed_child1_devinder", -3500, GEN4_Y, "Child 1", "male"))
edges.append(create_edge("m_devinder_rabinder", "unnamed_child1_devinder", "bottom", "top"))

nodes.append(create_person("unnamed_child2_devinder", -3200, GEN4_Y, "Child 2", "female"))
edges.append(create_edge("m_devinder_rabinder", "unnamed_child2_devinder", "bottom", "top"))

# Children of Gauri Shankar & Kaushalya Devi
# 1. Pran Nath Sood
start_pran = 0
nodes.append(create_person("pran", start_pran, GEN4_Y, "Pran Nath Sood", "male", "1911"))
edges.append(create_edge("m_gauri_kaushalya", "pran", "bottom", "top"))

nodes.append(create_person("gyanwati", start_pran + SPOUSE_GAP_X, GEN4_Y, "Gyanwati Sood", "female", "1915"))
mx_pran = get_marriage_x(start_pran)
nodes.append(create_marriage("m_pran_gyanwati", mx_pran, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("pran", "m_pran_gyanwati", "right", "left", "straight"))
edges.append(create_edge("m_pran_gyanwati", "gyanwati", "right", "left", "straight"))

# 2. Surender Nath Sood
start_surender = 6000
nodes.append(create_person("surender", start_surender, GEN4_Y, "Surender Nath Sood", "male", "1923"))
edges.append(create_edge("m_gauri_kaushalya", "surender", "bottom", "top"))

nodes.append(create_person("sarla", start_surender + SPOUSE_GAP_X, GEN4_Y, "Sarla Sood", "female"))
mx_surender = get_marriage_x(start_surender)
nodes.append(create_marriage("m_surender_sarla", mx_surender, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("surender", "m_surender_sarla", "right", "left", "straight"))
edges.append(create_edge("m_surender_sarla", "sarla", "right", "left", "straight"))

# 3. Saraswati Devi Dhanda
start_saraswati = 10000
nodes.append(create_person("saraswati", start_saraswati, GEN4_Y, "Saraswati Devi Dhanda", "female"))
edges.append(create_edge("m_gauri_kaushalya", "saraswati", "bottom", "top"))

nodes.append(create_person("ramrakha", start_saraswati + SPOUSE_GAP_X, GEN4_Y, "Ram Rakha Dhanda", "male"))
mx_saraswati = get_marriage_x(start_saraswati)
nodes.append(create_marriage("m_saraswati_ram", mx_saraswati, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("saraswati", "m_saraswati_ram", "right", "left", "straight"))
edges.append(create_edge("m_saraswati_ram", "ramrakha", "right", "left", "straight"))

# 4. Puspa Sood (Sister of Saraswati & Surender)
start_puspa = 14000
nodes.append(create_person("puspa_sood", start_puspa, GEN4_Y, "Puspa Sood", "female"))
edges.append(create_edge("m_gauri_kaushalya", "puspa_sood", "bottom", "top"))

nodes.append(create_person("amarnath_sud", start_puspa + SPOUSE_GAP_X, GEN4_Y, "Amarnath Sud", "male"))
mx_puspa = get_marriage_x(start_puspa)
nodes.append(create_marriage("m_puspa_amarnath", mx_puspa, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("puspa_sood", "m_puspa_amarnath", "right", "left", "straight"))
edges.append(create_edge("m_puspa_amarnath", "amarnath_sud", "right", "left", "straight"))

# Amarnath Sud Second Marriage (Anjana Sud)
nodes.append(create_person("anjana_sud", start_puspa + SPOUSE_GAP_X * 2, GEN4_Y, "Anjana Sud", "female"))
mx_amarnath_anjana = get_marriage_x(start_puspa + SPOUSE_GAP_X)
nodes.append(create_marriage("m_amarnath_anjana", mx_amarnath_anjana, GEN4_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("amarnath_sud", "m_amarnath_anjana", "right", "left", "straight"))
edges.append(create_edge("m_amarnath_anjana", "anjana_sud", "right", "left", "straight"))


# ==========================================
# GENERATION 5
# ==========================================
GEN5_Y = Y_SPACING * 4

# --- Children of Pran Nath Sood & Gyanwati Sood ---
# 1. Saroj Sood Kashyap
start_saroj = -2800
nodes.append(create_person("saroj", start_saroj, GEN5_Y, "Saroj Sood Kashyap", "female", "1937"))
edges.append(create_edge("m_pran_gyanwati", "saroj", "bottom", "top"))

nodes.append(create_person("ravindra", start_saroj + SPOUSE_GAP_X, GEN5_Y, "Rabindra Nath Kashyap", "male"))
mx_saroj = get_marriage_x(start_saroj)
nodes.append(create_marriage("m_saroj_ravindra", mx_saroj, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("saroj", "m_saroj_ravindra", "right", "left", "straight"))
edges.append(create_edge("m_saroj_ravindra", "ravindra", "right", "left", "straight"))

# 2. Vinod Sood Gopal
start_vinod = -1400
nodes.append(create_person("vinod", start_vinod, GEN5_Y, "Vinod Sood Gopal", "female", "1939"))
edges.append(create_edge("m_pran_gyanwati", "vinod", "bottom", "top"))

nodes.append(create_person("satish", start_vinod + SPOUSE_GAP_X, GEN5_Y, "Brig. Satish Chandra Gopal", "male"))
mx_vinod = get_marriage_x(start_vinod)
nodes.append(create_marriage("m_vinod_satish", mx_vinod, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("vinod", "m_vinod_satish", "right", "left", "straight"))
edges.append(create_edge("m_vinod_satish", "satish", "right", "left", "straight"))

# 3. Jatinder Nath Sood
start_jatinder = 0
nodes.append(create_person("jatinder", start_jatinder, GEN5_Y, "Jatinder Nath Sood", "male", "1942", pet_name="Jiti"))
edges.append(create_edge("m_pran_gyanwati", "jatinder", "bottom", "top"))

nodes.append(create_person("kusum_lata", start_jatinder + SPOUSE_GAP_X, GEN5_Y, "Kusum Lata Sood", "female", "1946"))
mx_jatinder = get_marriage_x(start_jatinder)
nodes.append(create_marriage("m_jatinder_kusum", mx_jatinder, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("jatinder", "m_jatinder_kusum", "right", "left", "straight"))
edges.append(create_edge("m_jatinder_kusum", "kusum_lata", "right", "left", "straight"))

# 4. Virendra Mohan Sood
start_virendra = 1400
nodes.append(create_person("virendra", start_virendra, GEN5_Y, "Virendra Mohan Sood", "male", "1944", pet_name="Guddu"))
edges.append(create_edge("m_pran_gyanwati", "virendra", "bottom", "top"))

nodes.append(create_person("smriti", start_virendra + SPOUSE_GAP_X, GEN5_Y, "Smriti Sood", "female", "1952"))
mx_virendra = get_marriage_x(start_virendra)
nodes.append(create_marriage("m_virendra_smriti", mx_virendra, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("virendra", "m_virendra_smriti", "right", "left", "straight"))
edges.append(create_edge("m_virendra_smriti", "smriti", "right", "left", "straight"))

# 5. Ravinder Nath Sood
start_ravinder = 2800
nodes.append(create_person("ravinder", start_ravinder, GEN5_Y, "Ravinder Nath Sood", "male", "1948", pet_name="Ram / Ramu"))
edges.append(create_edge("m_pran_gyanwati", "ravinder", "bottom", "top"))

nodes.append(create_person("bala", start_ravinder + SPOUSE_GAP_X, GEN5_Y, "Bala Sood", "female"))
mx_ravinder = get_marriage_x(start_ravinder)
nodes.append(create_marriage("m_ravinder_bala", mx_ravinder, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("ravinder", "m_ravinder_bala", "right", "left", "straight"))
edges.append(create_edge("m_ravinder_bala", "bala", "right", "left", "straight"))

# --- Children of Surender Nath Sood & Sarla Sood ---
# 1. Rajiv Sood
start_rajiv = 5000
nodes.append(create_person("rajiv", start_rajiv, GEN5_Y, "Rajiv Sood", "male"))
edges.append(create_edge("m_surender_sarla", "rajiv", "bottom", "top"))

nodes.append(create_person("neelam", start_rajiv + SPOUSE_GAP_X, GEN5_Y, "Neelam Sood", "female"))
mx_rajiv = get_marriage_x(start_rajiv)
nodes.append(create_marriage("m_rajiv_neelam", mx_rajiv, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("rajiv", "m_rajiv_neelam", "right", "left", "straight"))
edges.append(create_edge("m_rajiv_neelam", "neelam", "right", "left", "straight"))

# 2. Renuka Sood
nodes.append(create_person("renuka", 6200, GEN5_Y, "Renuka Sood", "female"))
edges.append(create_edge("m_surender_sarla", "renuka", "bottom", "top"))

# --- Children of Saraswati Devi Dhanda & Ram Rakha Dhanda ---
start_ramesh = 8000
nodes.append(create_person("ramesh", start_ramesh, GEN5_Y, "Ramesh Dhanda", "male"))
edges.append(create_edge("m_saraswati_ram", "ramesh", "bottom", "top"))

nodes.append(create_person("usha_dhanda", start_ramesh + SPOUSE_GAP_X, GEN5_Y, "Usha Dhanda", "female"))
mx_ramesh = get_marriage_x(start_ramesh)
nodes.append(create_marriage("m_ramesh_usha", mx_ramesh, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("ramesh", "m_ramesh_usha", "right", "left", "straight"))
edges.append(create_edge("m_ramesh_usha", "usha_dhanda", "right", "left", "straight"))

start_suresh = 9200
nodes.append(create_person("suresh", start_suresh, GEN5_Y, "Suresh Dhanda", "male"))
edges.append(create_edge("m_saraswati_ram", "suresh", "bottom", "top"))

nodes.append(create_person("vibha", start_suresh + SPOUSE_GAP_X, GEN5_Y, "Vibha Dhanda", "female"))
mx_suresh = get_marriage_x(start_suresh)
nodes.append(create_marriage("m_suresh_vibha", mx_suresh, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("suresh", "m_suresh_vibha", "right", "left", "straight"))
edges.append(create_edge("m_suresh_vibha", "vibha", "right", "left", "straight"))

nodes.append(create_person("vijay_dhanda", 10200, GEN5_Y, "Vijay Dhanda", "male"))
edges.append(create_edge("m_saraswati_ram", "vijay_dhanda", "bottom", "top"))

nodes.append(create_person("anand_dhanda", 10600, GEN5_Y, "Anand Dhanda", "male"))
edges.append(create_edge("m_saraswati_ram", "anand_dhanda", "bottom", "top"))

start_bimla = 11000
nodes.append(create_person("bimla_dhanda", start_bimla, GEN5_Y, "Bimla Dhanda", "female"))
edges.append(create_edge("m_saraswati_ram", "bimla_dhanda", "bottom", "top"))

nodes.append(create_person("rajendra_lal_ravi", start_bimla + SPOUSE_GAP_X, GEN5_Y, "Rajendra Lal Ravi", "male"))
mx_bimla = get_marriage_x(start_bimla)
nodes.append(create_marriage("m_bimla_rajendra", mx_bimla, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("bimla_dhanda", "m_bimla_rajendra", "right", "left", "straight"))
edges.append(create_edge("m_bimla_rajendra", "rajendra_lal_ravi", "right", "left", "straight"))

start_bala_d = 12200
nodes.append(create_person("bala_dhanda", start_bala_d, GEN5_Y, "Bala Dhanda", "female"))
edges.append(create_edge("m_saraswati_ram", "bala_dhanda", "bottom", "top"))

nodes.append(create_person("ishwar_chand", start_bala_d + SPOUSE_GAP_X, GEN5_Y, "Ishwar Chand", "male"))
mx_bala_d = get_marriage_x(start_bala_d)
nodes.append(create_marriage("m_bala_ishwar", mx_bala_d, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("bala_dhanda", "m_bala_ishwar", "right", "left", "straight"))
edges.append(create_edge("m_bala_ishwar", "ishwar_chand", "right", "left", "straight"))

nodes.append(create_person("yashveer_dhanda", 13200, GEN5_Y, "Yashveer Dhanda", "male"))
edges.append(create_edge("m_saraswati_ram", "yashveer_dhanda", "bottom", "top"))

start_chandra = 13600
nodes.append(create_person("chandra_prabha_dhanda", start_chandra, GEN5_Y, "Chandra Prabha Dhanda", "female"))
edges.append(create_edge("m_saraswati_ram", "chandra_prabha_dhanda", "bottom", "top"))

nodes.append(create_person("som_prakash_arya", start_chandra + SPOUSE_GAP_X, GEN5_Y, "Som Prakash Arya", "male"))
mx_chandra = get_marriage_x(start_chandra)
nodes.append(create_marriage("m_chandra_som", mx_chandra, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("chandra_prabha_dhanda", "m_chandra_som", "right", "left", "straight"))
edges.append(create_edge("m_chandra_som", "som_prakash_arya", "right", "left", "straight"))

start_sudesh = 14800
nodes.append(create_person("sudesh_dhanda", start_sudesh, GEN5_Y, "Sudesh Dhanda", "female"))
edges.append(create_edge("m_saraswati_ram", "sudesh_dhanda", "bottom", "top"))

nodes.append(create_person("kulvir_raj_bedi", start_sudesh + SPOUSE_GAP_X, GEN5_Y, "Kulvir Raj Bedi", "male"))
mx_sudesh = get_marriage_x(start_sudesh)
nodes.append(create_marriage("m_sudesh_kulvir", mx_sudesh, GEN5_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("sudesh_dhanda", "m_sudesh_kulvir", "right", "left", "straight"))
edges.append(create_edge("m_sudesh_kulvir", "kulvir_raj_bedi", "right", "left", "straight"))

# --- Child of Amarnath Sud & Anjana Sud ---
nodes.append(create_person("ajit_sud", 15800, GEN5_Y, "Ajit Sud (Gogi Uncle)", "male"))
edges.append(create_edge("m_amarnath_anjana", "ajit_sud", "bottom", "top"))


# ==========================================
# GENERATION 6
# ==========================================
GEN6_Y = Y_SPACING * 5

# --- Children of Saroj & Rabindra Nath Kashyap ---
nodes.append(create_person("anu_k", -3200, GEN6_Y, "Anu Kashyap Dua", "female"))
edges.append(create_edge("m_saroj_ravindra", "anu_k", "bottom", "top"))

nodes.append(create_person("ritu", -2900, GEN6_Y, "Ritu Kashyap Minocha", "female"))
edges.append(create_edge("m_saroj_ravindra", "ritu", "bottom", "top"))

nodes.append(create_person("rupal", -2600, GEN6_Y, "Rupal Kashyap", "female"))
edges.append(create_edge("m_saroj_ravindra", "rupal", "bottom", "top"))

nodes.append(create_person("ashish", -2300, GEN6_Y, "Ashish Kashyap", "male"))
edges.append(create_edge("m_saroj_ravindra", "ashish", "bottom", "top"))

# --- Children of Vinod & Brig. Satish Chandra Gopal ---
start_reema_b = -1800
nodes.append(create_person("reema_b", start_reema_b, GEN6_Y, "Reema Bhatia", "female"))
edges.append(create_edge("m_vinod_satish", "reema_b", "bottom", "top"))

nodes.append(create_person("arvind", start_reema_b + SPOUSE_GAP_X, GEN6_Y, "Arvind Bhatia", "male"))
mx_reema_b = get_marriage_x(start_reema_b)
nodes.append(create_marriage("m_reema_arvind", mx_reema_b, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("reema_b", "m_reema_arvind", "right", "left", "straight"))
edges.append(create_edge("m_reema_arvind", "arvind", "right", "left", "straight"))

start_naveen = -1000
nodes.append(create_person("naveen", start_naveen, GEN6_Y, "Naveen Gopal", "male"))
edges.append(create_edge("m_vinod_satish", "naveen", "bottom", "top"))

nodes.append(create_person("reema_g", start_naveen + SPOUSE_GAP_X, GEN6_Y, "Reema Gopal", "female"))
mx_naveen = get_marriage_x(start_naveen)
nodes.append(create_marriage("m_naveen_reema", mx_naveen, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("naveen", "m_naveen_reema", "right", "left", "straight"))
edges.append(create_edge("m_naveen_reema", "reema_g", "right", "left", "straight"))

# --- Children of Jatinder Nath Sood & Kusum Lata Sood ---
start_nitin = -200
nodes.append(create_person("nitin", start_nitin, GEN6_Y, "Nitin Sood", "male", "1972"))
edges.append(create_edge("m_jatinder_kusum", "nitin", "bottom", "top"))

nodes.append(create_person("neeru", start_nitin + SPOUSE_GAP_X, GEN6_Y, "Neeru Sood", "female"))
mx_nitin = get_marriage_x(start_nitin)
nodes.append(create_marriage("m_nitin_neeru", mx_nitin, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("nitin", "m_nitin_neeru", "right", "left", "straight"))
edges.append(create_edge("m_nitin_neeru", "neeru", "right", "left", "straight"))

nodes.append(create_person("shruti_kirti", 500, GEN6_Y, "Shruti Kirti Sood", "female", "1978"))
edges.append(create_edge("m_jatinder_kusum", "shruti_kirti", "bottom", "top"))

# --- Children of Virendra Mohan Sood & Smriti Sood ---
start_rishi = 1200
nodes.append(create_person("rishi", start_rishi, GEN6_Y, "Rishi Sood", "male", "1977"))
edges.append(create_edge("m_virendra_smriti", "rishi", "bottom", "top"))

nodes.append(create_person("usha_sood", start_rishi + SPOUSE_GAP_X, GEN6_Y, "Usha Sood", "female", "1977"))
mx_rishi = get_marriage_x(start_rishi)
nodes.append(create_marriage("m_rishi_usha", mx_rishi, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("rishi", "m_rishi_usha", "right", "left", "straight"))
edges.append(create_edge("m_rishi_usha", "usha_sood", "right", "left", "straight"))

start_gautam = 2000
nodes.append(create_person("gautam", start_gautam, GEN6_Y, "Gautam Sood", "male", "1980"))
edges.append(create_edge("m_virendra_smriti", "gautam", "bottom", "top"))

nodes.append(create_person("amanda", start_gautam + SPOUSE_GAP_X, GEN6_Y, "Amanda Sood", "female"))
mx_gautam = get_marriage_x(start_gautam)
nodes.append(create_marriage("m_gautam_amanda", mx_gautam, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("gautam", "m_gautam_amanda", "right", "left", "straight"))
edges.append(create_edge("m_gautam_amanda", "amanda", "right", "left", "straight"))

# --- Children of Ravinder Nath Sood & Bala Sood ---
start_mohit = 2800
nodes.append(create_person("mohit", start_mohit, GEN6_Y, "Mohit Sood", "male", "1980"))
edges.append(create_edge("m_ravinder_bala", "mohit", "bottom", "top"))

nodes.append(create_person("delcine", start_mohit + SPOUSE_GAP_X, GEN6_Y, "Delcine", "female"))
mx_mohit = get_marriage_x(start_mohit)
nodes.append(create_marriage("m_mohit_delcine", mx_mohit, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("mohit", "m_mohit_delcine", "right", "left", "straight"))
edges.append(create_edge("m_mohit_delcine", "delcine", "right", "left", "straight"))

start_monica = 3800
nodes.append(create_person("monica", start_monica, GEN6_Y, "Monica Sood", "female", "1987"))
edges.append(create_edge("m_ravinder_bala", "monica", "bottom", "top"))

nodes.append(create_person("anupam", start_monica + SPOUSE_GAP_X, GEN6_Y, "Anupam Gupta", "male"))
mx_monica = get_marriage_x(start_monica)
nodes.append(create_marriage("m_monica_anupam", mx_monica, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("monica", "m_monica_anupam", "right", "left", "straight"))
edges.append(create_edge("m_monica_anupam", "anupam", "right", "left", "straight"))

# --- Children of Rajiv Sood & Neelam Sood ---
start_amit = 4600
nodes.append(create_person("amit", start_amit, GEN6_Y, "Amit Sood", "male"))
edges.append(create_edge("m_rajiv_neelam", "amit", "bottom", "top"))

nodes.append(create_person("sherley", start_amit + SPOUSE_GAP_X, GEN6_Y, "Sherley Sood", "female"))
mx_amit = get_marriage_x(start_amit)
nodes.append(create_marriage("m_amit_sherley", mx_amit, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("amit", "m_amit_sherley", "right", "left", "straight"))
edges.append(create_edge("m_amit_sherley", "sherley", "right", "left", "straight"))

# Anuj Sood (Son of Rajiv & Neelam Sood)
start_anuj = 5400
nodes.append(create_person("anuj", start_anuj, GEN6_Y, "Anuj Sood", "male"))
edges.append(create_edge("m_rajiv_neelam", "anuj", "bottom", "top"))

nodes.append(create_person("noor", start_anuj + SPOUSE_GAP_X, GEN6_Y, "Noor Sood", "female"))
mx_anuj = get_marriage_x(start_anuj)
nodes.append(create_marriage("m_anuj_noor", mx_anuj, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("anuj", "m_anuj_noor", "right", "left", "straight"))
edges.append(create_edge("m_anuj_noor", "noor", "right", "left", "straight"))

nodes.append(create_person("rati", 6200, GEN6_Y, "Rati Sood", "female"))
edges.append(create_edge("m_rajiv_neelam", "rati", "bottom", "top"))

# --- Child of Ramesh Dhanda & Usha Dhanda ---
nodes.append(create_person("amita_dhanda", 8140, GEN6_Y, "Amita Dhanda", "female"))
edges.append(create_edge("m_ramesh_usha", "amita_dhanda", "bottom", "top"))

# --- Children of Suresh Dhanda & Vibha Dhanda ---
nodes.append(create_person("suvir", 9000, GEN6_Y, "Suvir Dhanda", "male"))
edges.append(create_edge("m_suresh_vibha", "suvir", "bottom", "top"))

nodes.append(create_person("abha", 9340, GEN6_Y, "Abha Dhanda", "female"))
edges.append(create_edge("m_suresh_vibha", "abha", "bottom", "top"))

nodes.append(create_person("veenu", 9680, GEN6_Y, "Veenu Dhanda", "female"))
edges.append(create_edge("m_suresh_vibha", "veenu", "bottom", "top"))

# --- Children of Bimla Dhanda & Rajendra Lal Ravi ---
start_prashant_r = 10600
nodes.append(create_person("prashant_ravi", start_prashant_r, GEN6_Y, "Prashant Ravi", "male"))
edges.append(create_edge("m_bimla_rajendra", "prashant_ravi", "bottom", "top"))

nodes.append(create_person("padma_ravi", start_prashant_r + SPOUSE_GAP_X, GEN6_Y, "Padma Ravi", "female"))
mx_prashant_r = get_marriage_x(start_prashant_r)
nodes.append(create_marriage("m_prashant_padma", mx_prashant_r, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("prashant_ravi", "m_prashant_padma", "right", "left", "straight"))
edges.append(create_edge("m_prashant_padma", "padma_ravi", "right", "left", "straight"))

nodes.append(create_person("ashok_ravi", 11400, GEN6_Y, "Ashok Ravi", "male"))
edges.append(create_edge("m_bimla_rajendra", "ashok_ravi", "bottom", "top"))

start_upendra_r = 11800
nodes.append(create_person("upendra_ravi", start_upendra_r, GEN6_Y, "Upendra Ravi", "male"))
edges.append(create_edge("m_bimla_rajendra", "upendra_ravi", "bottom", "top"))

nodes.append(create_person("namrata_ravi", start_upendra_r + SPOUSE_GAP_X, GEN6_Y, "Namrata Ravi", "female"))
mx_upendra_r = get_marriage_x(start_upendra_r)
nodes.append(create_marriage("m_upendra_namrata", mx_upendra_r, GEN6_Y + MARRIAGE_Y_OFFSET))
edges.append(create_edge("upendra_ravi", "m_upendra_namrata", "right", "left", "straight"))
edges.append(create_edge("m_upendra_namrata", "namrata_ravi", "right", "left", "straight"))

# --- Children of Chandra Prabha Dhanda & Som Prakash Arya ---
nodes.append(create_person("unnamed_child1_chandra_prabha", 13600, GEN6_Y, "Child 1", "male"))
edges.append(create_edge("m_chandra_som", "unnamed_child1_chandra_prabha", "bottom", "top"))

nodes.append(create_person("unnamed_child2_chandra_prabha", 13900, GEN6_Y, "Child 2", "female"))
edges.append(create_edge("m_chandra_som", "unnamed_child2_chandra_prabha", "bottom", "top"))

# --- Children of Sudesh Dhanda & Kulvir Raj Bedi ---
nodes.append(create_person("ajay_bedi", 14800, GEN6_Y, "Ajay Bedi", "male"))
edges.append(create_edge("m_sudesh_kulvir", "ajay_bedi", "bottom", "top"))

nodes.append(create_person("unnamed_child_sudesh", 15100, GEN6_Y, "Child", "female"))
edges.append(create_edge("m_sudesh_kulvir", "unnamed_child_sudesh", "bottom", "top"))


# ==========================================
# GENERATION 7
# ==========================================
GEN7_Y = Y_SPACING * 6

# Child of Reema Bhatia & Arvind Bhatia
nodes.append(create_person("vani", -1660, GEN7_Y, "Vani Bhatia", "female"))
edges.append(create_edge("m_reema_arvind", "vani", "bottom", "top"))

# Children of Naveen Gopal & Reema Gopal
nodes.append(create_person("muskaan", -900, GEN7_Y, "Muskaan Gopal", "female"))
edges.append(create_edge("m_naveen_reema", "muskaan", "bottom", "top"))

nodes.append(create_person("mehak", -600, GEN7_Y, "Mehak Gopal", "female"))
edges.append(create_edge("m_naveen_reema", "mehak", "bottom", "top"))

# Son of Nitin Sood & Neeru Sood (Bhavesh Sood!)
nodes.append(create_person("bhavesh", -60, GEN7_Y, "Bhavesh Sood", "male", "2001"))
edges.append(create_edge("m_nitin_neeru", "bhavesh", "bottom", "top"))

# Children of Rishi Sood & Usha Sood
nodes.append(create_person("anika_sood", 1250, GEN7_Y, "Anika Sood", "female", "2015"))
edges.append(create_edge("m_rishi_usha", "anika_sood", "bottom", "top"))

nodes.append(create_person("vihaan_sood", 1550, GEN7_Y, "Vihaan Sood", "male", "2018"))
edges.append(create_edge("m_rishi_usha", "vihaan_sood", "bottom", "top"))

# Child of Gautam Sood & Amanda Sood
nodes.append(create_person("sanaya_sood", 2140, GEN7_Y, "Serena Sood", "female"))
edges.append(create_edge("m_gautam_amanda", "sanaya_sood", "bottom", "top"))

# Children of Mohit Sood & Delcine
nodes.append(create_person("saya_sood", 2700, GEN7_Y, "Saya Sood", "female"))
edges.append(create_edge("m_mohit_delcine", "saya_sood", "bottom", "top"))

nodes.append(create_person("aditya_sood", 2950, GEN7_Y, "Aditya Sood", "male", "2011"))
edges.append(create_edge("m_mohit_delcine", "aditya_sood", "bottom", "top"))

nodes.append(create_person("sana_sood", 3200, GEN7_Y, "Sana Sood", "female", "2014"))
edges.append(create_edge("m_mohit_delcine", "sana_sood", "bottom", "top"))

# Children of Monica Sood & Anupam Gupta
nodes.append(create_person("riya_gupta", 3800, GEN7_Y, "Riya Gupta", "female"))
edges.append(create_edge("m_monica_anupam", "riya_gupta", "bottom", "top"))

nodes.append(create_person("siya_gupta", 4100, GEN7_Y, "Siya Gupta", "female"))
edges.append(create_edge("m_monica_anupam", "siya_gupta", "bottom", "top"))

# Children of Amit Sood & Sherley Sood
nodes.append(create_person("shiv", 4600, GEN7_Y, "Shiv Sood", "male"))
edges.append(create_edge("m_amit_sherley", "shiv", "bottom", "top"))

nodes.append(create_person("ananya", 4900, GEN7_Y, "Ananya Sood", "female"))
edges.append(create_edge("m_amit_sherley", "ananya", "bottom", "top"))

# Child of Anuj Sood & Noor Sood
nodes.append(create_person("anaia", 5550, GEN7_Y, "Anaia Sood", "female"))
edges.append(create_edge("m_anuj_noor", "anaia", "bottom", "top"))

# Children of Upendra Ravi & Namrata Ravi
nodes.append(create_person("gautam_ravi", 11800, GEN7_Y, "Gautam Ravi", "male"))
edges.append(create_edge("m_upendra_namrata", "gautam_ravi", "bottom", "top"))

nodes.append(create_person("gaurav_ravi", 12100, GEN7_Y, "Gaurav Ravi", "male"))
edges.append(create_edge("m_upendra_namrata", "gaurav_ravi", "bottom", "top"))


# ==========================================
# OUTPUT & FILE WRITING
# ==========================================
data = {"nodes": nodes, "edges": edges}

with open("tree_data.json", "w") as f:
    json.dump(data, f, indent=2)

js_content = f"""
// Auto-generated from complete family tree audit
export const initialNodes = {json.dumps(nodes, indent=4)};
export const initialEdges = {json.dumps(edges, indent=4)};
"""

with open("../src/store/initialData.js", "w") as f:
    f.write(js_content)

person_count = len([n for n in nodes if n['type']=='person'])
print(f"Data successfully seeded: {len(nodes)} total nodes ({person_count} person cards)!")
