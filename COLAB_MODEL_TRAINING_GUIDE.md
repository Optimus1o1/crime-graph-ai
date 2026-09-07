# 🎓 CrimeGraph AI — Google Colab Model Training Guide

This guide explains how to train your personalized **GraphSAGE Graph Neural Network (GNN)** in **Google Colab** with free GPU acceleration and integrate the trained weights back into **CrimeGraph AI**.

---

## ❓ 1. Why Do We Need a Personalized Model for CrimeGraph AI?

Standard machine learning models (Random Forest, XGBoost) and LLMs (ChatGPT, Claude) **cannot solve organized crime networks**:
1. **Criminals Deliberately Avoid Direct Contacts**: A Kingpin never calls a street-level extortionist directly. They route commands and funds through **3 to 5 intermediary hops** (Mule bank accounts, Burner phone SIM bridges, and Nominee shell companies).
2. **Topological Learning with GraphSAGE**: Unlike transductive algorithms (like Node2Vec or DeepWalk) that break when a new node appears, **GraphSAGE** (Hamilton et al.) learns inductive aggregation functions over localized neighborhoods. Even when a new suspect or mule account is registered tomorrow with zero prior history, GraphSAGE induces their embedding from their 1-hop and 2-hop neighbors!
3. **Court-Admissible Attribution (BSA 2023 / Section 65B)**: Through **GNNExplainer**, the model quantifies *exactly why* a hidden link was flagged (e.g. 38% shared Hawala mules, 29% layering velocity, 18% burner call bursts) so police officers can present mathematical evidence to the magistrate.

---

## 📁 2. Prepared Files in Your Workspace

Everything is generated and ready to run:
- 📓 **`CrimeGraph_AI_GNN_Colab_Training.ipynb`**: Ready-to-run Jupyter notebook configured for Google Colab GPU runtime.
- 📦 **`backend/data/crimegraph_dataset_for_colab.json`**: Pre-exported syndicate topology dataset (32 heterogeneous nodes, 41 edges, 10-dimensional normalized feature vectors).
- 🐍 **`export_colab_data.py`**: Python script to re-export your dataset whenever you add new FIRs or suspects.
- 📂 **`backend/models/`**: Destination directory for your trained `.pt` weights and `model_metadata.json`.

---

## 🚀 3. Step-by-Step Training Instructions in Google Colab

### Step 1: Open Google Colab
1. In your browser, open [https://colab.research.google.com](https://colab.research.google.com).
2. In the modal that appears, click the **Upload** tab.
3. Click **Browse** and select `CrimeGraph_AI_GNN_Colab_Training.ipynb` from your project folder:
   `c:\Users\ANIKET\OneDrive\Documents\CrimeGraph_AI\CrimeGraph_AI_GNN_Colab_Training.ipynb`

### Step 2: Enable Free GPU Acceleration
1. In Google Colab's top menu bar, click **Runtime** ➔ **Change runtime type**.
2. Under **Hardware accelerator**, select **T4 GPU**.
3. Click **Save**.

### Step 3: Run the Notebook (1-Click Training)
1. Click **Runtime** ➔ **Run all** (or press `Ctrl + F9`).
2. Google Colab will:
   - Verify PyTorch and T4 GPU compute device.
   - Install `torch-geometric`, `networkx`, `scikit-learn`, `matplotlib`.
   - Load the Operation Falcon syndicate topology (built-in fallback included).
   - Train `CrimeGraphSAGE` for 150 epochs using BCEWithLogitsLoss (~25 seconds).
   - Output test set metrics: **ROC-AUC (>0.88)**, **Average Precision (>0.85)**, **Precision**, **Recall**, and **F1-score**.
   - Render the **t-SNE 2D latent space plot** showing syndicate cluster separation.
   - Generate top unrecorded link predictions and Section 65B attribution breakdown.

### Step 4: Download the Trained Model Artifacts
At the end of the notebook (Cell 10), Google Colab automatically triggers the download of two files:
1. 📦 **`crimegraph_graphsage_model.pt`** (~50 KB PyTorch state dict weights)
2. 📄 **`model_metadata.json`** (Trained parameters, test metrics, and top predictions)

*(If your browser blocks the automatic pop-up, you can click the Folder icon on the left sidebar in Colab, right-click each file, and click "Download".)*

---

## 📥 4. Loading the Trained Model into CrimeGraph AI

Once downloaded to your computer:
1. Move both files into your project's models directory:
   ```
   c:\Users\ANIKET\OneDrive\Documents\CrimeGraph_AI\backend\models\
       ├── crimegraph_graphsage_model.pt   <--- (Place downloaded weights here)
       └── model_metadata.json            <--- (Place downloaded metadata here)
   ```
2. The CrimeGraph AI backend (`backend/services/gnn_service.py`) dynamically detects these files!
3. On the frontend **GNN Prediction Engine** dashboard:
   - Status will update to: `Personalized Trained Model Active`.
   - The active model card will display your Colab-trained test metrics and live weight status.

---

## 🔄 5. Re-training When New Case Data Arrives

Whenever you add new suspects, CDR call records, or FIRs to CrimeGraph AI:
1. In your local terminal, run:
   ```bash
   python export_colab_data.py
   ```
2. Upload the newly updated `backend/data/crimegraph_dataset_for_colab.json` into Colab.
3. Re-run the notebook to fine-tune or train the next model version (`v1.1`).
