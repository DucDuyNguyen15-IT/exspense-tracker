import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

async def test_key():
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"--- Đang kiểm tra Key: {api_key[:10]}... ---")
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash') # Dùng bản 1.5 cho ổn định để test
        response = await model.generate_content_async("Hello, are you working?")
        print("✅ Kết quả từ AI:", response.text)
    except Exception as e:
        print("❌ LỖI THỰC TẾ TỪ GOOGLE:")
        print(str(e))

if __name__ == "__main__":
    asyncio.run(test_key())
