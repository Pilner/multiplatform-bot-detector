<h1 style="text-align: center">Multiplatform Malicious Bot Detector</h1>

<p style="text-align: center">Multiplatform Ensemble-Based Malicious Bot Detection
System Using Semi-Supervised Self-Training Approach
</p>

## How to use

1. Clone into a local directory.

```bash
git clone https://github.com/Pilner/multiplatform-bot-detector.git
cd ./multiplatform-bot-detector
```

2. Have two terminal sessions, one for the frontend and the backend folder.

```bash
# Terminal 1
cd frontend
```

```bash
# Terminal 2
cd backend
```

3. Follow the `README.md` of each folder.

---

### Malicious Bot Detecting

Sample `.json` input file is at `backend/data/input_data.json`

```
backend/
- data/
| - input_data.json
```

### Tool Performance

Sample `.parquet` file is at: `backend/data/FINAL/testing/combined/combined_testing_accounts_ROBERTA_LDA_missing_dropped_2.parquet`

```
backend/
- data/
| - FINAL/
| | - testing/
| | | - combined/
| | | | - combined_testing_accounts_ROBERTA_LDA_missing_dropped_2.parquet
```
