import json
from collections import defaultdict

def load_and_analyze_json(file_path):
    # Đọc file JSON
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Phân tích cơ bản
    print(f"Tổng số mẫu: {len(data)}")
    
    # Thống kê theo ID
    id_stats = defaultdict(int)
    split_stats = defaultdict(int)
    token_stats = defaultdict(int)
    
    for item in data:
        id_stats[item['id']] += 1
        split_stats[item['split']] += 1
        for caption_tokens in item['processed_tokens']:
            token_stats[item['id']] += len(caption_tokens)
    
    print("\nThống kê theo ID:")
    for id, count in id_stats.items():
        print(f"ID {id}: {count} mẫu")
    
    print("\nThống kê theo split:")
    for split, count in split_stats.items():
        print(f"Split '{split}': {count} mẫu")
    
    print("\nThống kê số tokens theo ID:")
    for id, count in token_stats.items():
        print(f"ID {id}: {count} tokens")
    
    return data

def extract_features(data):
    # Trích xuất các đặc trưng quan trọng
    features = []
    
    for item in data:
        feature = {
            'id': item['id'],
            'file_path': item['file_path'],
            'split': item['split'],
            'num_captions': len(item['captions']),
            'avg_tokens_per_caption': sum(len(tokens) for tokens in item['processed_tokens']) / len(item['processed_tokens']),
            'common_words': get_common_words(item['processed_tokens'])
        }
        features.append(feature)
    
    return features

def get_common_words(processed_tokens_list):
    # Tìm các từ xuất hiện thường xuyên trong các caption
    word_count = defaultdict(int)
    
    for tokens in processed_tokens_list:
        for token in tokens:
            cleaned_token = token.lower().strip('.,!?')
            if cleaned_token:
                word_count[cleaned_token] += 1
    
    # Lấy top 5 từ phổ biến
    common_words = sorted(word_count.items(), key=lambda x: x[1], reverse=True)[:5]
    return [word for word, count in common_words]

def save_to_json(data, output_path):
    # Lưu dữ liệu đã xử lý ra file JSON mới
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Sử dụng các hàm
if __name__ == "__main__":
    input_file = "data.json"  # Thay bằng đường dẫn file input của bạn
    output_file = "processed_data.json"  # File output
    
    # 1. Đọc và phân tích dữ liệu
    json_data = load_and_analyze_json(input_file)
    
    # 2. Trích xuất đặc trưng
    features = extract_features(json_data)
    
    # 3. Lưu kết quả
    save_to_json(features, output_file)
    print(f"\nĐã lưu dữ liệu đã xử lý vào {output_file}")