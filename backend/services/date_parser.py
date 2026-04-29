import re
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import calendar

# Định nghĩa timezone
VN_TZ = ZoneInfo("Asia/Ho_Chi_Minh")

class DateParseError(Exception):
    """Lỗi khi không thể nhận dạng ngày tháng"""
    pass

def get_now_vn():
    """Lấy thời gian hiện tại tại Việt Nam"""
    return datetime.now(VN_TZ)

def parse_date(raw_date: str) -> datetime:
    """
    Chuyển đổi chuỗi ngày tháng tự nhiên sang đối tượng datetime.
    Mặc định trả về thời gian 00:00:00 của ngày đó.
    """
    now = get_now_vn().replace(hour=0, minute=0, second=0, microsecond=0)
    raw_date = raw_date.lower().strip()

    # 1. Hôm nay / Hôm qua
    if raw_date in ["today", "hôm nay"]:
        return now
    if raw_date in ["yesterday", "hôm qua"]:
        return now - timedelta(days=1)

    # 2. Đầu tháng / Cuối tháng
    if raw_date == "đầu tháng":
        return now.replace(day=1)
    if raw_date == "cuối tháng":
        # calendar.monthrange returns (weekday_of_first_day, number_of_days_in_month)
        last_day = calendar.monthrange(now.year, now.month)[1]
        return now.replace(day=last_day)
    
    # 3. Tháng trước
    if raw_date == "tháng trước":
        first_day_current_month = now.replace(day=1)
        last_day_prev_month = first_day_current_month - timedelta(days=1)
        return last_day_prev_month.replace(day=1)

    # 4. Định dạng DD/MM hoặc DD-MM (vd: 15/3, 15-3)
    match_ddmm = re.match(r"^(\d{1,2})[/-](\d{1,2})$", raw_date)
    if match_ddmm:
        day, month = map(int, match_ddmm.groups())
        try:
            return now.replace(year=now.year, month=month, day=day)
        except ValueError:
            raise DateParseError("Ngày tháng không hợp lệ (vd: 31/02). Vui lòng nhập lại dạng DD/MM.")

    # 5. Thứ X tuần trước (vd: thứ 2 tuần trước, cn tuần trước)
    if "tuần trước" in raw_date:
        weekday_map = {
            "thứ 2": 0, "thứ 3": 1, "thứ 4": 2, "thứ 5": 3, 
            "thứ 6": 4, "thứ 7": 5, "cn": 6, "chủ nhật": 6
        }
        for name, target_weekday in weekday_map.items():
            if name in raw_date:
                # current_weekday (now.weekday()) vs target_weekday
                # logic: if today is Wed(2) and target is Mon(0) -> 2 - 0 + 7 = 9 days ago
                days_ago = (now.weekday() - target_weekday) + 7
                return now - timedelta(days=days_ago)

    # 6. Fallback - Không nhận dạng được
    raise DateParseError("Tui hông hiểu ngày này lắm. Bạn nhập kiểu '15/3' cho chắc ăn nhé!")

# --- SCRIPT CHẠY THỬ NGHIỆM ---
def run_tests():
    tests = [
        "hôm nay", "Hôm qua", "đầu tháng", "cuối tháng", 
        "tháng trước", "15/3", "20-10", "thứ 2 tuần trước", "cn tuần trước"
    ]
    
    print(f"Bây giờ là: {get_now_vn().strftime('%Y-%m-%d %H:%M')}")
    print("-" * 40)
    for t in tests:
        try:
            result = parse_date(t)
            print(f"Input: '{t:18}' -> Result: {result.strftime('%Y-%m-%d')}")
        except DateParseError as e:
            print(f"Input: '{t:18}' -> Error: {e}")

if __name__ == "__main__":
    run_tests()
