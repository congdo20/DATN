Test chất lượng module tách cụm danh từ trong 1 câu tiếng Việt
--------------------------
Tasks:
1. Cài đặt module xử lý tiếng Việt, có phần tách cụm Danh từ (noun phrase chunking):
- Cách 1: Xử lý tách cụm danh từ từ Part-of-speech (POS) và 1 số luật tạo cụm danh từ (giống như của NLTK) 
	+ Cách 1.1: Thành đã làm trên Underthesea => chuyển giao lại. 
	+ Cách 1.2: Thử lại trên các tool tách POS khác 
	
- Cách 2: Dựa trên thông tin từ khối phân tích cú pháp phụ thuộc (dependency parsing)
	+ Cài đặt 1 trong số các tool dependency parsing cho tiếng Việt
	+ Trích rút kết quả Object là Noun phrase từ các Object phát hiện được (có thể kết hợp cùng thông tin POS)

Có 3 toolkits thử nghiệm (có Pos tagging và dependency parsing)
https://github.com/VinAIResearch/PhoNLP; 
https://github.com/undertheseanlp/underthesea; 
https://pypi.org/project/seacorenlp/
	
2. Test trên bộ dữ liệu VNPersonSearch-3k
- Tạo 1 tập ground truth khoảng 1000 câu, gán nhãn Noun phrase bằng tay
- So sánh với kết quả trích rút trên các module tự động
