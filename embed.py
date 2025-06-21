import sys, json
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
text = sys.stdin.read()
emb = model.encode(text).tolist()
print(json.dumps(emb))
