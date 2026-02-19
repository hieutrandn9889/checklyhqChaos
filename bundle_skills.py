import os

# Cấu hình đường dẫn
SKILLS_DIR = ".claude/skills/playwright-cli"
OUTPUT_FILE = "gemini_super_prompt.md"

def bundle_md_files():
    if not os.path.exists(SKILLS_DIR):
        print(f"❌ Không tìm thấy thư mục: {SKILLS_DIR}")
        return

    content_blocks = [
        "# SYSTEM INSTRUCTIONS: PLAYWRIGHT EXPERT KNOWLEDGE\n",
        "Dưới đây là toàn bộ tài liệu kỹ năng và quy trình của project. ",
        "Hãy ghi nhớ các kiến thức này để hỗ trợ tôi viết code và chạy test.\n\n"
    ]

    # Duyệt qua thư mục gốc của skill và thư mục references
    for root, dirs, files in os.walk(SKILLS_DIR):
        for file in files:
            if file.endswith(".md"):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, SKILLS_DIR)
                
                print(f"📦 Đang đóng gói: {relative_path}")
                
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    # Tạo block phân tách rõ ràng cho từng file
                    content_blocks.append(f"---")
                    content_blocks.append(f"## SOURCE_FILE: {relative_path}")
                    content_blocks.append(content)
                    content_blocks.append("\n")

    # Xuất ra file cuối cùng
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(content_blocks))

    print(f"\n✅ Đã xong! Hãy copy nội dung từ file '{OUTPUT_FILE}' và dán vào Gemini.")

if __name__ == "__main__":
    bundle_md_files()