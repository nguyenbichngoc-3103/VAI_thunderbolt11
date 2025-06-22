# V Boost AI - Zalo Mini App

## 🚀 Hướng dẫn tích hợp vào Zalo Mini App

### 1. Chuẩn bị
- Tài khoản Zalo Developer
- App ID từ Zalo Developer Console
- Domain được whitelist

### 2. Cấu hình
1. **Đăng ký Mini App** tại [Zalo Developer Console](https://developers.zalo.me/)
2. **Cập nhật manifest.json**:
   ```json
   {
     "app_id": "YOUR_APP_ID_HERE",
     "name": "V Boost AI",
     "description": "Trợ lý AI thông minh cho mọi nghề nghiệp"
   }
   ```

### 3. Tính năng tích hợp
- ✅ **Zalo SDK**: Tích hợp đầy đủ Zalo Mini App SDK
- ✅ **User Profile**: Lấy thông tin người dùng Zalo
- ✅ **Share**: Chia sẻ app với bạn bè
- ✅ **Analytics**: Theo dõi hành vi người dùng
- ✅ **Theme**: Tùy chỉnh giao diện theo Zalo

### 4. Triển khai
1. Upload code lên hosting
2. Cấu hình domain trong Zalo Developer Console
3. Test trên Zalo app
4. Submit để review và publish

### 5. Cấu trúc file
```
zalo-mini-app/
├── manifest.json      # Cấu hình Mini App
├── index.html         # Giao diện chính
├── icons/            # Icons cho app
└── README.md         # Hướng dẫn này
```

### 6. Tính năng chính
- 🌱 **6 nghề nghiệp**: Nông dân, Doanh nhân, Giáo viên, Lập trình viên, Bác sĩ, Luật sư
- 🤖 **AI Assistant**: Trả lời thông minh theo nghề nghiệp
- 📱 **Mobile-first**: Tối ưu cho điện thoại
- 🎨 **Zalo UI**: Giao diện phù hợp với Zalo
- 📊 **Analytics**: Theo dõi sử dụng

### 7. API Endpoints (nếu cần)
```javascript
// Lấy thông tin user
const userInfo = await ZaloMiniApp.getUserInfo();

// Chia sẻ app
await ZaloMiniApp.share({
  title: 'V Boost AI',
  description: 'Trợ lý AI thông minh',
  url: 'your-app-url'
});

// Track events
ZaloMiniApp.trackEvent('career_selected', { career: 'farmer' });
```

### 8. Lưu ý
- App phải tuân thủ [Zalo Mini App Guidelines](https://developers.zalo.me/docs/mini-app/guidelines)
- Test kỹ trước khi submit
- Đảm bảo performance tốt trên mobile
- Tuân thủ quy định về nội dung

---

**V Boost AI** - Nâng tầm trải nghiệm với Zalo Mini App! 🚀 