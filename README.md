# AICapstone
By Alejandro Akifarry, Jungyu Lee, Pak Wah Wong, Pratheepan Gunaratnam, Sirada Thoungvitayasutee
## For the backend
1. Modify environment variables inside the file '.env.example' and then save as '.env'
2. Create environment (e.g. conda create aicapstone)
```console
conda create --name aicapstone
conda activate aicapstone
pip install "fastapi[standard]"
pip install transformers
pip install openai
pip install pymongo
pip install pyjwt
pip install "passlib[bcrypt]"
pip install astrapy
pip install scikit-learn
pip install sentence-transformers
pip install pytest
pip install vaderSentiment
```
3. Install [PyTorch](https://pytorch.org/get-started/locally/)
```console
pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
```
4. To get a new SECRET_KEY (Optional)
```
openssl rand -hex 32
```
5. Run the server with:
```console
cd backend/app
fastapi dev main.py
```
6. To exit FastAPI which is a multithreaded application for Windows, open a new command prompt and run:
```console
taskkill /f /im python.exe
```
7. To run the unit test:
```console
cd backend/app
* Example Command: 
pytest tests/test_openai_service.py 
pytest tests/test_vectordb_service.py::TestVectoredService::test_generate_advice_successful
```

## For the frontend
1. Install dependencies
```console
npm install

```
2. Run app
```console
npm start
```
