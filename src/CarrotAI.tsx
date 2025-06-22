import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Send, Leaf, Sun, CloudRain, Thermometer, Clock, ChevronRight, Lightbulb, Calendar, Droplets, Sprout, Carrot, Shield, Zap, BookOpen, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: Suggestion[];
  followUpQuestions?: string[];
  type?: 'info' | 'warning' | 'success' | 'error';
}

interface Suggestion {
  id: string;
  text: string;
  category: string;
  icon: string;
  color: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  forecast: string;
}

interface CarrotGrowthStage {
  stage: string;
  days: number;
  tasks: string[];
  tips: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: 'watering' | 'fertilizing' | 'pest-control' | 'harvesting' | 'general';
}

const CarrotAI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState<CarrotGrowthStage | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    condition: 'Nắng nhẹ',
    forecast: 'Thời tiết thuận lợi cho cà rốt'
  });

  // Các giai đoạn phát triển của cà rốt
  const carrotStages: CarrotGrowthStage[] = [
    {
      stage: 'Gieo hạt',
      days: 0,
      tasks: ['Chuẩn bị đất tơi xốp', 'Ngâm hạt 4-6 giờ', 'Gieo hạt cách nhau 8-10cm'],
      tips: ['Chọn hạt giống chất lượng', 'Đất phải thoát nước tốt', 'Phủ nhẹ đất và giữ ẩm']
    },
    {
      stage: 'Nảy mầm',
      days: 7,
      tasks: ['Tưới nước nhẹ mỗi ngày', 'Giữ ẩm đất', 'Tránh ánh nắng trực tiếp'],
      tips: ['Không tưới quá nhiều', 'Che chắn nếu nắng gắt', 'Kiểm tra độ ẩm đất']
    },
    {
      stage: 'Phát triển lá',
      days: 15,
      tasks: ['Tỉa thưa cây', 'Bón phân NPK 16-16-8', 'Tưới nước đều đặn'],
      tips: ['Giữ khoảng cách 8-10cm giữa các cây', 'Bón phân pha loãng', 'Tưới vào sáng sớm']
    },
    {
      stage: 'Phát triển củ',
      days: 30,
      tasks: ['Bón phân Kali cao', 'Tưới nước đều', 'Kiểm tra sâu bệnh'],
      tips: ['Kali giúp củ ngọt và chắc', 'Không để đất khô', 'Phòng bệnh thán thư']
    },
    {
      stage: 'Thu hoạch',
      days: 80,
      tasks: ['Kiểm tra độ chín', 'Thu hoạch từng phần', 'Bảo quản đúng cách'],
      tips: ['Thu khi lá bắt đầu vàng', 'Không để quá già', 'Rửa sạch và bảo quản mát']
    }
  ];

  // Gợi ý thông minh cho cà rốt
  const smartSuggestions: Suggestion[] = [
    { id: '1', text: 'Phân bón tốt cho mùa này', category: 'fertilizer', icon: '💩', color: 'bg-green-500' },
    { id: '2', text: 'Thời tiết bây giờ nên trồng gì?', category: 'weather', icon: '🌤️', color: 'bg-blue-500' },
    { id: '3', text: 'Kỹ thuật diệt cỏ hiệu quả nhất', category: 'weed', icon: '🧑‍🌾', color: 'bg-orange-500' },
    { id: '4', text: 'Cách phòng sâu bệnh tự nhiên', category: 'pest', icon: '🛡️', color: 'bg-purple-500' },
    { id: '5', text: 'Lịch bón phân cho cây ăn quả', category: 'fertilizer', icon: '📅', color: 'bg-pink-500' },
    { id: '6', text: 'Cách nhận biết đất tốt', category: 'soil', icon: '🌱', color: 'bg-yellow-500' },
    { id: '7', text: 'Dự báo giá nông sản', category: 'price', icon: '💰', color: 'bg-emerald-500' },
    { id: '8', text: 'Hướng dẫn làm đất hữu cơ', category: 'soil', icon: '🌾', color: 'bg-yellow-700' },
    { id: '9', text: 'Cách tưới tiết kiệm nước', category: 'watering', icon: '💧', color: 'bg-cyan-500' },
    { id: '10', text: 'Cách chọn giống năng suất cao', category: 'seed', icon: '🌻', color: 'bg-indigo-500' }
  ];

  // Phản hồi AI cho cà rốt
  const aiResponses = {
    greeting: [
      "Chào chú/cô! Cháu là NôngTrí, chuyên gia nông nghiệp đây ạ! 🌱\n\nCháu có thể giúp chú/cô:\n• Tư vấn phân bón và chăm sóc cây trồng\n• Dự báo thời tiết và khuyến nghị trồng trọt\n• Hướng dẫn kỹ thuật nông nghiệp hiện đại\n• Phòng trừ sâu bệnh hiệu quả\n• Dự báo giá nông sản\n\nChú/cô cần cháu hỗ trợ gì hôm nay ạ?"
    ],
    guide: {
      basic: "🥕 Hướng dẫn trồng cà rốt cơ bản:\n\n1️⃣ Thời vụ: Tháng 10-1 (mùa khô mát)\n2️⃣ Đất trồng: Tơi xốp, thoát nước tốt\n3️⃣ Gieo hạt: Cách nhau 8-10cm\n4️⃣ Chăm sóc: Tưới nước, bón phân đều đặn\n5️⃣ Thu hoạch: Sau 80-100 ngày\n\nChú/cô muốn biết chi tiết về bước nào ạ?",
      detailed: {
        soil: "🪴 Chuẩn bị đất trồng cà rốt:\n• Đất tơi xốp, cao ráo\n• pH: 6.0-7.0\n• Trộn: Đất + phân bò hoai + tro trấu\n• Làm luống cao 20-30cm\n• Rộng luống: 1-1.2m",
        seeding: "🌱 Kỹ thuật gieo hạt:\n• Ngâm hạt nước ấm 4-6 giờ\n• Ủ khăn ẩm 1 ngày\n• Gieo hàng cách hàng 20-25cm\n• Cây cách cây 8-10cm\n• Phủ nhẹ đất và giữ ẩm",
        care: "🧑‍🌾 Chăm sóc cà rốt:\n• Tưới nước: Sáng sớm hoặc chiều mát\n• Bón phân:\n  - 15 ngày: NPK 16-16-8\n  - 30 ngày: Kali + phân chuồng\n  - 45 ngày: Kali cao\n• Tỉa thưa khi cây cao 5-7cm",
        harvest: "⏰ Thu hoạch cà rốt:\n• Thời gian: 80-100 ngày\n• Dấu hiệu: Lá bắt đầu vàng\n• Cách thu: Nhổ từng cây\n• Bảo quản: Rửa sạch, để mát"
      }
    },
    weather: {
      good: "🌤️ Thời tiết hiện tại và gợi ý trồng trọt:\n\n📅 Tháng hiện tại: Tháng 12\n• Nhiệt độ: 25-30°C (lý tưởng)\n• Độ ẩm: 70-80% (phù hợp)\n\n🌱 Nên trồng:\n• Cà rốt, cải bắp, súp lơ\n• Dưa leo, đậu đũa\n• Rau cải các loại\n• Hành, tỏi\n\n⚠️ Tránh trồng:\n• Cây ưa nóng (ớt, cà chua)\n• Cây cần nhiều nước\n\n✅ Khuyến nghị:\n• Tưới nước đều đặn\n• Bón phân hữu cơ\n• Phòng bệnh thán thư"
    },
    disease: {
      yellow_leaves: "🟡 Cà rốt bị vàng lá:\n\n🔍 Nguyên nhân:\n• Thiếu dinh dưỡng (N, Mg)\n• Bệnh thán thư\n• Tưới nước không đều\n• Đất chua\n\n💊 Cách xử lý:\n• Bón phân NPK cân đối\n• Phun thuốc sinh học\n• Điều chỉnh pH đất\n• Tưới nước đều đặn",
      root_rot: "🟤 Cà rốt bị thối củ:\n\n🔍 Nguyên nhân:\n• Đất ẩm ướt quá lâu\n• Bệnh nấm rễ\n• Tưới nước quá nhiều\n• Đất không thoát nước\n\n💊 Cách xử lý:\n• Cải thiện thoát nước\n• Phun thuốc nấm\n• Giảm tưới nước\n• Cách ly cây bị bệnh"
    },
    fertilizer: {
      basic: "💩 Phân bón tốt cho mùa này:\n\n🌱 Mùa khô (tháng 10-3):\n• Phân NPK 20-20-15: Tăng sức đề kháng\n• Phân Kali cao: Giúp cây chịu hạn\n• Phân hữu cơ vi sinh: Cải thiện đất\n\n🌧️ Mùa mưa (tháng 4-9):\n• Phân NPK 16-16-8: Phát triển cân đối\n• Phân Canxi: Chống thối rễ\n• Phân vi lượng: Tăng chất lượng\n\n💡 Lưu ý:\n• Bón phân vào sáng sớm\n• Tưới nước sau khi bón\n• Không bón khi trời mưa"
    },
    watering: {
      basic: "💧 Tưới nước cho cà rốt:\n\n⏰ Thời gian tưới:\n• Sáng sớm: 6-8h\n• Chiều mát: 17-19h\n\n💧 Lượng nước:\n• Giai đoạn đầu: Nhẹ nhàng\n• Giai đoạn phát triển: Đều đặn\n• Giai đoạn củ: Vừa phải\n\n⚠️ Lưu ý:\n• Không tưới quá nhiều\n• Tránh tưới vào buổi trưa\n• Kiểm tra độ ẩm đất",
      efficient: "💧 Cách tưới tiết kiệm nước:\n\n🚿 Hệ thống tưới nhỏ giọt:\n• Tiết kiệm 30-50% nước\n• Tưới trực tiếp vào gốc\n• Không làm ướt lá\n• Tự động hóa dễ dàng\n\n🌧️ Tưới phun sương:\n• Tăng độ ẩm không khí\n• Làm mát cây trồng\n• Tiết kiệm nước\n• Phù hợp rau ăn lá\n\n⏰ Thời gian tưới:\n• Sáng sớm: 6-8h\n• Chiều mát: 17-19h\n• Tránh tưới buổi trưa\n• Không tưới khi mưa\n\n💡 Kỹ thuật tiết kiệm:\n• Tưới theo nhu cầu cây\n• Sử dụng nước mưa\n• Che phủ đất\n• Trồng cây chịu hạn\n\n🛠️ Thiết bị hỗ trợ:\n• Béc tưới nhỏ giọt\n• Timer tự động\n• Cảm biến độ ẩm\n• Bồn chứa nước mưa"
    },
    pest: {
      basic: "🛡️ Phòng trừ sâu bệnh cà rốt:\n\n🐛 Sâu bệnh thường gặp:\n• Sâu xanh ăn lá\n• Bọ trĩ\n• Bệnh thán thư\n• Bệnh nấm rễ\n\n💊 Thuốc sinh học:\n• Bacillus thuringiensis\n• Abamectin\n• Trichoderma\n• Neem oil\n\n🛡️ Biện pháp phòng ngừa:\n• Vệ sinh vườn thường xuyên\n• Trồng xen canh\n• Kiểm tra định kỳ",
      natural: "🛡️ Cách phòng sâu bệnh tự nhiên:\n\n🌿 Biện pháp sinh học:\n• Trồng cây xua đuổi: Sả, húng quế, bạc hà\n• Nuôi thiên địch: Ong ký sinh, bọ rùa\n• Sử dụng nấm đối kháng: Trichoderma\n• Vi khuẩn có ích: Bacillus thuringiensis\n\n🌱 Biện pháp canh tác:\n• Vệ sinh vườn thường xuyên\n• Trồng xen canh đa dạng\n• Luân canh cây trồng\n• Chọn giống kháng bệnh\n\n💧 Dung dịch tự chế:\n• Nước tỏi ớt: Xua đuổi sâu\n• Nước tro bếp: Diệt nấm\n• Nước lá neem: Diệt côn trùng\n• Nước gừng: Chống thối rễ\n\n🌿 Cây thuốc nam:\n• Lá xoan: Diệt sâu\n• Cây sả: Xua muỗi\n• Lá ổi: Chống nấm\n• Vỏ bưởi: Diệt rệp"
    },
    weed: {
      basic: "🧑‍🌾 Kỹ thuật diệt cỏ hiệu quả nhất:\n\n🛡️ Phương pháp cơ học:\n• Nhổ cỏ bằng tay: Hiệu quả 100%\n• Cắt cỏ định kỳ: 2-3 lần/tháng\n• Làm đất kỹ trước khi trồng\n• Phủ rơm rạ: Ngăn cỏ mọc\n\n🌿 Phương pháp sinh học:\n• Trồng cây phủ đất\n• Sử dụng vi sinh vật\n• Nuôi gà, vịt thả vườn\n• Trồng xen canh\n\n💊 Thuốc diệt cỏ sinh học:\n• Glyphosate: Diệt cỏ toàn diện\n• 2,4-D: Diệt cỏ lá rộng\n• Paraquat: Diệt cỏ tiếp xúc\n\n⚠️ Lưu ý:\n• Đọc kỹ hướng dẫn sử dụng\n• Phun vào sáng sớm\n• Tránh phun vào cây trồng"
    },
    soil: {
      good: "🌱 Cách nhận biết đất tốt:\n\n👁️ Quan sát bằng mắt:\n• Màu đất: Đen, nâu đậm (giàu mùn)\n• Kết cấu: Tơi xốp, không vón cục\n• Độ ẩm: Giữ ẩm tốt, không ngập úng\n• Rễ cây: Phát triển mạnh, không thối\n\n🤏 Kiểm tra bằng tay:\n• Sờ vào đất: Mềm, dính nhẹ\n• Nắm đất: Tạo viên, không vỡ\n• Độ pH: 6.0-7.0 (dùng giấy quỳ)\n• Mùi: Thơm, không hôi\n\n🔬 Kiểm tra khoa học:\n• Đo pH đất: 6.0-7.5\n• Hàm lượng mùn: >2%\n• Độ thoát nước: Tốt\n• Vi sinh vật: Phong phú\n\n💡 Dấu hiệu đất xấu:\n• Màu trắng, vàng nhạt\n• Cứng, vón cục\n• Khô cằn, không giữ ẩm\n• Có mùi hôi, chua"
    },
    organic: {
      basic: "🌾 Hướng dẫn làm đất hữu cơ:\n\n🔄 Quy trình làm đất:\n• Cày xới đất sâu 20-30cm\n• Phơi ải 7-10 ngày\n• Bón phân chuồng hoai mục\n• Trộn đều với đất\n\n💩 Phân hữu cơ:\n• Phân bò: 20-30kg/100m²\n• Phân gà: 10-15kg/100m²\n• Phân trùn quế: 5-10kg/100m²\n• Tro bếp: 2-3kg/100m²\n\n🌿 Cải thiện đất:\n• Trồng cây phân xanh\n• Ủ rác thải nhà bếp\n• Sử dụng vi sinh vật\n• Luân canh cây trồng\n\n⏰ Thời gian:\n• Làm đất: 2-3 tuần trước trồng\n• Ủ phân: 3-6 tháng\n• Cải tạo: 6-12 tháng\n\n💡 Lợi ích:\n• Đất tơi xốp, thoát nước tốt\n• Giàu dinh dưỡng tự nhiên\n• Ít sâu bệnh\n• Năng suất cao, bền vững"
    },
    seed: {
      high_yield: "🌻 Cách chọn giống năng suất cao:\n\n🔍 Tiêu chí chọn giống:\n• Năng suất cao, ổn định\n• Kháng bệnh tốt\n• Chất lượng sản phẩm tốt\n• Thích nghi với điều kiện địa phương\n• Thời gian sinh trưởng phù hợp\n\n🌱 Nguồn giống uy tín:\n• Viện nghiên cứu nông nghiệp\n• Công ty giống có uy tín\n• Trung tâm khuyến nông\n• Hợp tác xã nông nghiệp\n\n📋 Kiểm tra chất lượng:\n• Tỷ lệ nảy mầm >85%\n• Hạt đều, không bị sâu mọt\n• Bao bì nguyên vẹn\n• Hạn sử dụng còn dài\n\n💡 Lưu ý khi chọn:\n• Chọn giống phù hợp thời vụ\n• Xem xét điều kiện đất đai\n• Tính toán chi phí đầu tư\n• Tham khảo kinh nghiệm nông dân\n\n🌿 Giống tốt cho từng loại:\n• Lúa: IR50404, OM5451\n• Ngô: NK4300, CP888\n• Đậu: ĐX14, ĐT26\n• Rau: F1 hybrid các loại"
    },
    price: {
      forecast: "💰 Dự báo giá nông sản:\n\n🌾 Lúa gạo:\n• IR50404: 7,200-7,500 đ/kg\n• OM5451: 7,500-7,800 đ/kg\n• Xu hướng: Tăng nhẹ\n• Khuyến nghị: Bán từng phần\n\n🥕 Rau củ:\n• Cà rốt: 15,000-20,000 đ/kg\n• Bắp cải: 8,000-12,000 đ/kg\n• Cà chua: 12,000-18,000 đ/kg\n• Dưa leo: 10,000-15,000 đ/kg\n\n🍎 Trái cây:\n• Xoài: 15,000-25,000 đ/kg\n• Sầu riêng: 80,000-120,000 đ/kg\n• Dưa hấu: 8,000-12,000 đ/kg\n• Cam: 20,000-30,000 đ/kg\n\n📈 Yếu tố ảnh hưởng:\n• Cung cầu thị trường\n• Thời tiết, mùa vụ\n• Chất lượng sản phẩm\n• Đầu ra tiêu thụ\n\n💡 Lời khuyên:\n• Theo dõi thị trường thường xuyên\n• Liên kết với thương lái\n• Bảo quản tốt để bán được giá cao\n• Đa dạng hóa sản phẩm"
    }
  };

  const addMessage = (text: string, isUser: boolean, suggestions?: Suggestion[], followUp?: string[], type?: 'info' | 'warning' | 'success' | 'error') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      suggestions,
      followUpQuestions: followUp,
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('chào') || input.includes('hello') || input.includes('hi')) {
      return aiResponses.greeting[0];
    }
    
    if (input.includes('hướng dẫn') || input.includes('trồng') || input.includes('cách')) {
      return aiResponses.guide.basic;
    }
    
    if (input.includes('thời tiết') || input.includes('nắng') || input.includes('mưa')) {
      return aiResponses.weather.good;
    }
    
    if (input.includes('vàng lá') || input.includes('thối') || input.includes('bệnh')) {
      return aiResponses.disease.yellow_leaves;
    }
    
    if (input.includes('bón phân') || input.includes('phân')) {
      return aiResponses.fertilizer.basic;
    }
    
    if (input.includes('tưới nước') || input.includes('nước')) {
      return aiResponses.watering.basic;
    }
    
    if (input.includes('sâu bệnh') || input.includes('phòng trừ')) {
      return aiResponses.pest.natural;
    }
    
    if (input.includes('thu hoạch') || input.includes('khi nào')) {
      return aiResponses.guide.basic;
    }
    
    if (input.includes('giá') || input.includes('bao nhiêu')) {
      return aiResponses.price.forecast;
    }
    
    return "Dạ, cháu hiểu chú/cô đang hỏi về cà rốt. Chú/cô có thể hỏi cụ thể hơn về:\n• Hướng dẫn trồng cà rốt\n• Thời tiết phù hợp\n• Phòng trừ sâu bệnh\n• Bón phân, tưới nước\n• Thu hoạch và giá cả\n\nHoặc chú/cô có thể chọn gợi ý bên dưới ạ! 🥕";
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    addMessage(suggestion.text, true);
    setIsTyping(true);
    
    setTimeout(() => {
      let response = '';
      switch (suggestion.category) {
        case 'guide':
          response = aiResponses.guide.basic;
          break;
        case 'weather':
          response = aiResponses.weather.good;
          break;
        case 'disease':
          response = aiResponses.disease.yellow_leaves;
          break;
        case 'fertilizer':
          response = aiResponses.fertilizer.basic;
          break;
        case 'watering':
          response = aiResponses.watering.efficient;
          break;
        case 'pest':
          response = aiResponses.pest.natural;
          break;
        case 'harvest':
          response = aiResponses.guide.basic;
          break;
        case 'price':
          response = aiResponses.price.forecast;
          break;
        case 'weed':
          response = aiResponses.weed.basic;
          break;
        case 'soil':
          if (suggestion.text.includes('nhận biết')) {
            response = aiResponses.soil.good;
          } else {
            response = aiResponses.organic.basic;
          }
          break;
        case 'seed':
          response = aiResponses.seed.high_yield;
          break;
        default:
          response = generateResponse(suggestion.text);
      }
      
      addMessage(response, false, smartSuggestions);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText, true);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = generateResponse(inputText);
        addMessage(response, false, smartSuggestions);
        setIsTyping(false);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    // Khởi tạo tin nhắn chào mừng
    addMessage(aiResponses.greeting[0], false, smartSuggestions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-orange-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Carrot className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">NôngTrí - AI Nông Dân</h1>
              <p className="text-sm opacity-90">Chuyên gia trồng cà rốt 🥕</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4" />
              <span>{weatherData.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-1">
              <Droplets className="w-4 h-4" />
              <span>{weatherData.humidity}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-500 to-orange-500 p-4 text-white">
                <div className="flex items-center space-x-3">
                  <Bot className="w-6 h-6" />
                  <div>
                    <h2 className="font-semibold">Trò chuyện với NôngTrí</h2>
                    <p className="text-sm opacity-90">Hỏi gì về cà rốt cũng được ạ!</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                      {message.suggestions && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`w-full text-left p-2 rounded-lg text-xs transition-all hover:scale-105 ${suggestion.color} text-white`}
                            >
                              {suggestion.icon} {suggestion.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Hỏi gì về cà rốt..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-xl hover:from-green-600 hover:to-orange-600 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Growth Stage */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Giai đoạn phát triển</h3>
              </div>
              <div className="space-y-3">
                {carrotStages.map((stage, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg border-l-4 border-orange-400">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{stage.stage}</span>
                      <span className="text-xs text-gray-500">{stage.days} ngày</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {stage.tasks[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-800">Gợi ý cho nhà nông</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  className="p-2 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q1', text: 'Phân bón tốt cho mùa này', category: 'fertilizer', icon: '💩', color: 'bg-green-500'})}
                >
                  <Leaf className="w-4 h-4 mr-2 text-green-600" />Phân bón tốt cho mùa này
                </button>
                <button
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q2', text: 'Thời tiết bây giờ nên trồng gì?', category: 'weather', icon: '🌤️', color: 'bg-blue-500'})}
                >
                  <Sun className="w-4 h-4 mr-2 text-blue-500" />Thời tiết bây giờ nên trồng gì?
                </button>
                <button
                  className="p-2 bg-orange-100 text-orange-700 rounded-lg text-xs hover:bg-orange-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q3', text: 'Kỹ thuật diệt cỏ hiệu quả nhất', category: 'weed', icon: '🧑‍🌾', color: 'bg-orange-500'})}
                >
                  <Lightbulb className="w-4 h-4 mr-2 text-orange-500" />Kỹ thuật diệt cỏ hiệu quả nhất
                </button>
                <button
                  className="p-2 bg-purple-100 text-purple-700 rounded-lg text-xs hover:bg-purple-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q4', text: 'Cách phòng sâu bệnh tự nhiên', category: 'pest', icon: '🛡️', color: 'bg-purple-500'})}
                >
                  <Shield className="w-4 h-4 mr-2 text-purple-500" />Cách phòng sâu bệnh tự nhiên
                </button>
                <button
                  className="p-2 bg-pink-100 text-pink-700 rounded-lg text-xs hover:bg-pink-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q5', text: 'Lịch bón phân cho cây ăn quả', category: 'fertilizer', icon: '📅', color: 'bg-pink-500'})}
                >
                  <Calendar className="w-4 h-4 mr-2 text-pink-500" />Lịch bón phân cho cây ăn quả
                </button>
                <button
                  className="p-2 bg-yellow-100 text-yellow-700 rounded-lg text-xs hover:bg-yellow-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q6', text: 'Cách nhận biết đất tốt', category: 'soil', icon: '🌱', color: 'bg-yellow-500'})}
                >
                  <Sprout className="w-4 h-4 mr-2 text-yellow-500" />Cách nhận biết đất tốt
                </button>
                <button
                  className="p-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs hover:bg-emerald-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q7', text: 'Dự báo giá nông sản', category: 'price', icon: '💰', color: 'bg-emerald-500'})}
                >
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" />Dự báo giá nông sản
                </button>
                <button
                  className="p-2 bg-brown-100 text-brown-700 rounded-lg text-xs hover:bg-brown-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q8', text: 'Hướng dẫn làm đất hữu cơ', category: 'soil', icon: '🌾', color: 'bg-yellow-700'})}
                >
                  <BookOpen className="w-4 h-4 mr-2 text-yellow-700" />Hướng dẫn làm đất hữu cơ
                </button>
                <button
                  className="p-2 bg-cyan-100 text-cyan-700 rounded-lg text-xs hover:bg-cyan-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q9', text: 'Cách tưới tiết kiệm nước', category: 'watering', icon: '💧', color: 'bg-cyan-500'})}
                >
                  <Droplets className="w-4 h-4 mr-2 text-cyan-500" />Cách tưới tiết kiệm nước
                </button>
                <button
                  className="p-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs hover:bg-indigo-200 transition-colors w-full text-left flex items-center font-medium"
                  onClick={() => handleSuggestionClick({id: 'q10', text: 'Cách chọn giống năng suất cao', category: 'seed', icon: '🌻', color: 'bg-indigo-500'})}
                >
                  <Carrot className="w-4 h-4 mr-2 text-indigo-500" />Cách chọn giống năng suất cao
                </button>
              </div>
            </div>

            {/* Weather Info */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sun className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-800">Thời tiết</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nhiệt độ:</span>
                  <span className="font-medium">{weatherData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Độ ẩm:</span>
                  <span className="font-medium">{weatherData.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tình trạng:</span>
                  <span className="font-medium text-green-600">{weatherData.condition}</span>
                </div>
                <div className="mt-3 p-2 bg-green-50 rounded-lg text-xs text-green-700">
                  {weatherData.forecast}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrotAI; 