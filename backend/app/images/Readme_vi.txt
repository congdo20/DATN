---------------  VN-PERSON-SEARCH DATASET ------------------------------------
## Nguyên tắc chung
    Một người (id) có thể có nhiều ảnh, các ảnh này có thể được thu từ nhiều camera khác nhau, mỗi ảnh có thể có nhiều hơn 2 câu mô tả.
## Cấu trúc thư mục
    images      : chứa danh mục các hình ảnh người (Độ sâu tối đa là 3 cấp)  
    vn3k.json   : chứa thông tin mô tả cho các ảnh của 3000 người
    vn72.json   : chứa thông tin mô tả cho các ảnh của 72 người (là tập con của vn3k). Chỉ sử dụng hai thưc mục ảnh là images/TRAINNING_DATA VÀ images/TEST_DATA
## Thông tin CSDL 	
	- Hình ảnh người được thu nhận bởi nhiều loại camera khác nhau, với độ phân giải khác nhau
	- Hình ảnh người được cắt tự động từ video bằng các gải thuật phát hiện và theo vết và được chọn thủ công
	- Số lượng định danh (ID)			: 3000
	- Số lượng hình ảnh					: 6302 		
	- Số lượng câu mô tả				:12602  
	- Số ID có nhiều hơn 4 câu mô tả	:   72
	- Số ID có ít hơn 4 câu mô tả		:    0
	- Số ID có nhiều hơn 2 ảnh			:   72
	- Số ID có ít hơn 2 ảnh				:    0
## Định dạng
	- Các tệp .json chứa thông tin mô tả cho các ảnh với định dạng như sau:
		id 				: Định danh người
		file_path		: Đường dẫn đến tệp ảnh tương ứng
		split 			: Chưa dùng đến 
		captions		: Danh sách các câu mô tả tương ứng cho ảnh (bằng tiếng Việt)
		processed_tokens: Danh sách các câu mô tả đã được tách thành từ sử dụng thư viện (vncorenlp)
	- Tham khảo code đọc dữ liệu trơng tệp "vn3kinfo.ipynb"
	

    


		