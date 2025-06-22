import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Send, Leaf, Sun, CloudRain, Thermometer, Clock, ChevronRight, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: Suggestion[];
  followUpQuestions?: string[];
}

interface Suggestion {
  id: string;
  text: string;
  category: string;
  icon: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
}

interface ConversationContext {
  currentTopic: string;
  userPreferences: string[];
  followUpStage: number;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    currentTopic: '',
    userPreferences: [],
    followUpStage: 0
  });
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    condition: 'Nắng nhẹ'
  });

  // Enhanced AI responses with detailed information
  const aiResponses = {
    greeting: [
      "Chào chú/cô! Cháu là NôngTrí, chuyên gia nông nghiệp đây ạ! 🌱\n\nCháu có thể giúp chú/cô với:\n• Thông tin thời tiết chi tiết\n• Kỹ thuật trồng trọt, chăn nuôi\n• Phòng trừ sâu bệnh hiệu quả\n• Dự báo giá nông sản\n• Nhắc nhở công việc hàng ngày\n\nChú/cô cần cháu hỗ trợ gì hôm nay ạ?",
      "Xin chào! Cháu NôngTrí đây ạ! Sẵn sàng hỗ trợ chú/cô trong công việc nông nghiệp. Chú/cô có thể hỏi cháu về thời tiết, kỹ thuật trồng trọt, chăn nuôi, hoặc bất kỳ vấn đề nào khác nhé!"
    ],
    weather: {
      basic: "Dạ, hôm nay thời tiết khá thuận lợi cho việc canh tác ạ. Nhiệt độ 28°C, độ ẩm 75% - điều kiện tốt cho cây trồng phát triển.",
      detailed: {
        morning: "Buổi sáng (6-10h): Nhiệt độ 24-26°C, độ ẩm 80-85%. Thời điểm lý tưởng để tưới nước và bón phân ạ. Ánh nắng nhẹ giúp cây quang hợp tốt.",
        afternoon: "Buổi chiều (14-18h): Nhiệt độ 28-30°C, độ ẩm 65-70%. Chú/cô nên tránh tưới nước vào thời điểm này để tránh sốc nhiệt cho cây nhé.",
        evening: "Buổi tối (18-22h): Nhiệt độ 26-28°C, độ ẩm 75-80%. Chú/cô có thể tưới nước nhẹ nếu cần thiết ạ."
      },
      recommendations: [
        "Tưới nước vào sáng sớm (6-8h) để cây hấp thụ tốt nhất",
        "Bón phân hữu cơ vào buổi chiều mát",
        "Kiểm tra độ ẩm đất trước khi tưới",
        "Chuẩn bị che chắn nếu có mưa dự báo"
      ]
    },
    farming: {
      basic: "Dạ, để tăng năng suất cây trồng, chú/cô nên: 1) Tưới nước đều đặn vào sáng sớm, 2) Bón phân hữu cơ, 3) Kiểm tra sâu bệnh thường xuyên ạ.",
      detailed: {
        irrigation: "Hệ thống tưới nước thông minh:\n• Tưới nhỏ giọt: Tiết kiệm 30-50% nước\n• Tưới phun sương: Tăng độ ẩm không khí\n• Tưới theo chu kỳ: 2-3 lần/tuần tùy loại cây\n• Thời gian tưới: 6-8h sáng hoặc 17-19h chiều",
        fertilization: "Kỹ thuật bón phân hiệu quả:\n• Phân hữu cơ: Bón 2-3 lần/vụ\n• Phân NPK: Bón theo giai đoạn sinh trưởng\n• Phân vi sinh: Tăng cường hệ rễ\n• Liều lượng: 20-30kg/100m²",
        soil: "Cải thiện đất trồng:\n• Thêm phân chuồng hoai mục\n• Trộn đất với xơ dừa, tro trấu\n• Độ pH lý tưởng: 6.0-7.0\n• Thoát nước tốt, giữ ẩm"
      }
    },
    pest: {
      basic: "Dạ, để phòng trừ sâu bệnh hiệu quả: 1) Thường xuyên kiểm tra cây trồng, 2) Sử dụng thuốc sinh học, 3) Duy trì đa dạng sinh học trong vườn ạ.",
      detailed: {
        prevention: "Biện pháp phòng ngừa:\n• Vệ sinh vườn thường xuyên\n• Trồng xen canh các loại cây\n• Sử dụng giống kháng bệnh\n• Kiểm tra cây định kỳ 2-3 lần/tuần",
        biological: "Thuốc sinh học an toàn:\n• Bacillus thuringiensis: Diệt sâu ăn lá\n• Beauveria bassiana: Diệt côn trùng\n• Neem oil: Xua đuổi sâu bệnh\n• Trichoderma: Chống nấm bệnh",
        treatment: "Xử lý khi có sâu bệnh:\n• Cách ly cây bị bệnh\n• Phun thuốc vào sáng sớm\n• Tuân thủ thời gian cách ly\n• Ghi chép để theo dõi"
      }
    },
    rice: {
      basic: "Dạ, về trồng lúa ở miền Tây, cháu sẽ hướng dẫn chú/cô chi tiết về bón phân và chăm sóc hiệu quả ạ.",
      detailed: {
        season: "🌾 Thời vụ trồng lúa miền Tây:\n• Vụ Đông Xuân: Tháng 11-3\n• Vụ Hè Thu: Tháng 4-8\n• Vụ Thu Đông: Tháng 8-11",
        fertilizer: "💩 Bón phân cho lúa:\n• Bón lót: Phân chuồng + NPK 20-20-15\n• Bón thúc lần 1 (7-10 ngày): NPK 20-20-15\n• Bón thúc lần 2 (25-30 ngày): NPK 16-16-8\n• Bón đón đòng: NPK 12-12-17",
        care: "🌱 Chăm sóc lúa:\n• Tưới nước: Giữ mực nước 3-5cm\n• Làm cỏ: 2-3 lần/vụ\n• Phòng bệnh: Đạo ôn, khô vằn\n• Thu hoạch: Khi lúa chín 85-90%"
      }
    },
    chili: {
      basic: "Dạ, về cây ớt bị vàng lá và rụng trái, có thể do nấm hoặc thiếu dinh dưỡng. Cháu sẽ hướng dẫn chú/cô cách xử lý ạ.",
      detailed: {
        disease: "🦠 Bệnh thường gặp trên ớt:\n• Bệnh thán thư: Đốm nâu, thối trái\n• Bệnh héo rũ: Do nấm Fusarium\n• Bệnh đốm lá: Do vi khuẩn\n• Bệnh virus: Lá vàng, còi cọc",
        treatment: "💊 Cách xử lý:\n• Phun thuốc sinh học: Trichoderma, Bacillus\n• Thuốc hóa học: Mancozeb, Copper\n• Cách ly cây bị bệnh\n• Vệ sinh vườn thường xuyên",
        nutrition: "🌿 Thiếu dinh dưỡng:\n• Thiếu N: Lá vàng nhạt\n• Thiếu P: Lá tím, rễ kém\n• Thiếu K: Lá vàng viền, rụng trái\n• Bón phân cân đối NPK"
      }
    },
    chicken: {
      basic: "Dạ, về gà thả vườn ăn ít và tiêu chảy, có thể do bệnh hoặc thức ăn. Cháu sẽ hướng dẫn chú/cô cách xử lý ạ.",
      detailed: {
        disease: "🐔 Bệnh thường gặp:\n• Bệnh Newcastle: Tiêu chảy, thở khó\n• Bệnh Gumboro: Tiêu chảy trắng\n• Bệnh cầu trùng: Tiêu chảy có máu\n• Bệnh E.coli: Tiêu chảy, bỏ ăn",
        treatment: "💊 Cách xử lý:\n• Cách ly gà bị bệnh\n• Vệ sinh chuồng trại\n• Bổ sung vitamin, điện giải\n• Thuốc kháng sinh nếu cần",
        prevention: "🛡️ Phòng bệnh:\n• Tiêm phòng đầy đủ\n• Vệ sinh chuồng trại\n• Thức ăn sạch, nước sạch\n• Kiểm tra sức khỏe định kỳ"
      }
    },
    melon: {
      basic: "Dạ, dưa lưới là cây trồng có giá trị kinh tế cao. Cháu sẽ hướng dẫn chú/cô kỹ thuật trồng dưa lưới từ A-Z để đạt năng suất tối ưu ạ.",
      detailed: {
        season: "🍈 Thời vụ trồng dưa lưới:\n• Miền Nam: Tháng 11-4 (mùa khô)\n• Miền Bắc: Tháng 2-4 và 8-10\n• Tránh mùa mưa để giảm bệnh\n• Nhiệt độ lý tưởng: 25-30°C",
        soil: "🪴 Chuẩn bị đất:\n• Đất tơi xốp, cao ráo, thoát nước tốt\n• pH: 6.0-7.0\n• Trộn: Đất + phân bò hoai + tro trấu + trichoderma\n• Có thể trồng trong thùng xốp, bao xi măng",
        seeding: "🌱 Gieo hạt:\n• Ngâm hạt nước ấm (2 sôi:3 lạnh) 6-8h\n• Ủ khăn ẩm 1 ngày\n• Gieo vào bầu ươm hoặc thẳng chậu\n• Sau 7-10 ngày cây cao 10-15cm thì trồng",
        care: "🧑‍🌾 Chăm sóc:\n• Tưới nước mỗi sáng, tránh tối\n• Bón phân:\n  - 7 ngày: NPK 16-16-8 pha loãng\n  - 15-20 ngày: Phân hữu cơ vi sinh\n  - Khi ra hoa: Phân Kali cao",
        pollination: "🌼 Thụ phấn:\n• Thụ phấn bằng tay (sáng sớm trước 9h)\n• Lấy nhụy đực chấm nhụy cái\n• Hoa cái có bầu nhỏ dưới đáy\n• Quan trọng cho năng suất",
        trellis: "🕸️ Làm giàn:\n• Giàn chữ A hoặc treo dây nylon\n• Giúp trái sạch, không méo\n• Cây leo cần hỗ trợ\n• Khoảng cách giàn: 1.5-2m",
        disease: "🐛 Phòng bệnh:\n• Nấm hại rễ, rỉ trắng, bọ trĩ\n• Thuốc sinh học: Trichoderma, Radiant, Abamectin\n• Duy trì độ ẩm vừa phải\n• Vệ sinh vườn thường xuyên",
        harvest: "⏱ Thu hoạch:\n• Sau 65-75 ngày\n• Vỏ chuyển vàng nhạt\n• Có lưới rõ, thơm nhẹ\n• Năng suất: 2-3kg/trái"
      },
      tips: [
        "Chọn giống dưa lưới chất lượng cao",
        "Làm giàn ngay từ đầu để cây leo tốt",
        "Thụ phấn đúng thời điểm để đậu trái nhiều",
        "Bón phân cân đối để trái ngọt",
        "Phòng bệnh sớm để tránh thiệt hại"
      ]
    },
    durian: {
      basic: "Dạ, về cây sầu riêng giai đoạn ra hoa, cháu sẽ hướng dẫn chú/cô loại phân phù hợp ạ.",
      detailed: {
        flowering: "🌸 Giai đoạn ra hoa:\n• Dùng phân bón lá có Bo cao\n• NPK 15-30-15 hoặc 10-30-20\n• Bón qua lá 2-3 lần\n• Tưới nước đều đặn",
        care: "🌳 Chăm sóc sầu riêng:\n• Tỉa cành tạo tán\n• Bón phân hữu cơ gốc\n• Phòng bệnh thán thư\n• Thụ phấn nhân tạo nếu cần"
      }
    },
    coffee: {
      basic: "Dạ, về cây cà phê, cháu sẽ nhắc chú/cô bón phân định kỳ vào sáng thứ Bảy hàng tuần ạ.",
      detailed: {
        schedule: "📅 Lịch bón phân cà phê:\n• Tháng 2-3: Bón phân hữu cơ\n• Tháng 4-5: NPK 20-20-15\n• Tháng 6-7: NPK 16-16-8\n• Tháng 8-9: NPK 12-12-17",
        reminder: "⏰ Nhắc nhở:\n• Bón phân vào sáng thứ Bảy\n• Tưới nước sau khi bón\n• Kiểm tra sâu bệnh\n• Ghi chép để theo dõi"
      }
    },
    price: {
      basic: "Dạ, về giá nông sản, cháu sẽ cập nhật thông tin mới nhất cho chú/cô ạ.",
      detailed: {
        rice: "🌾 Giá lúa IR50404 Long An:\n• Hôm nay: 7,200-7,500 đ/kg\n• Tuần trước: 7,000-7,300 đ/kg\n• Xu hướng: Tăng nhẹ\n• Khuyến nghị: Bán từng phần",
        fruit: "🍎 Giá trái cây:\n• Xoài: 15,000-25,000 đ/kg\n• Sầu riêng: 80,000-120,000 đ/kg\n• Dưa lưới: 25,000-35,000 đ/kg\n• Cà phê: 45,000-55,000 đ/kg"
      }
    }
  };

  // Smart suggestions with categories
  const smartSuggestions: Suggestion[] = [
    { id: '1', text: 'Thời tiết hôm nay thế nào?', category: 'weather', icon: '🌤️' },
    { id: '2', text: 'Hướng dẫn trồng lúa miền Tây', category: 'rice', icon: '🌾' },
    { id: '3', text: 'Cây ớt bị vàng lá, rụng trái', category: 'chili', icon: '🌶️' },
    { id: '4', text: 'Gà thả vườn ăn ít, tiêu chảy', category: 'chicken', icon: '🐔' },
    { id: '5', text: 'Hướng dẫn trồng dưa lưới chi tiết', category: 'melon', icon: '🍈' },
    { id: '6', text: 'Bón phân cho sầu riêng ra hoa', category: 'durian', icon: '🌳' },
    { id: '7', text: 'Giá lúa IR50404 Long An hôm nay', category: 'price', icon: '💰' },
    { id: '8', text: 'Nhắc nhở bón phân cà phê', category: 'coffee', icon: '☕' }
  ];

  // Follow-up questions for each category
  const followUpQuestions = {
    weather: [
      "Chú/cô muốn biết thời tiết cho thời điểm nào trong ngày? (Sáng/Chiều/Tối)",
      "Chú/cô đang trồng loại cây gì để cháu đưa ra khuyến nghị phù hợp?",
      "Chú/cô có muốn biết dự báo thời tiết cho tuần tới không?"
    ],
    rice: [
      "Chú/cô đang trồng vụ nào? (Đông Xuân/Hè Thu/Thu Đông)",
      "Chú/cô muốn biết về khía cạnh nào? (Bón phân/Chăm sóc/Phòng bệnh)",
      "Diện tích lúa của chú/cô là bao nhiêu?"
    ],
    chili: [
      "Chú/cô thấy triệu chứng gì khác ngoài vàng lá, rụng trái?",
      "Cây ớt của chú/cô đang ở giai đoạn nào? (Mới trồng/Đang ra hoa/Đang có trái)",
      "Chú/cô muốn dùng phương pháp nào? (Sinh học/Hóa học/Tự nhiên)"
    ],
    chicken: [
      "Chú/cô thấy triệu chứng gì khác ngoài ăn ít, tiêu chảy?",
      "Gà của chú/cô đã tiêm phòng chưa?",
      "Chú/cô có thay đổi thức ăn gì gần đây không?"
    ],
    farming: [
      "Chú/cô đang trồng loại cây gì? (Rau, cây ăn quả, lúa, hoa màu...)",
      "Diện tích canh tác của chú/cô là bao nhiêu?",
      "Chú/cô muốn tập trung vào khía cạnh nào? (Tưới nước/Bón phân/Cải thiện đất)"
    ],
    pest: [
      "Chú/cô đang gặp vấn đề với loại sâu bệnh nào?",
      "Cây trồng của chú/cô đang ở giai đoạn nào? (Mới trồng/Đang phát triển/Chuẩn bị thu hoạch)",
      "Chú/cô muốn sử dụng phương pháp nào? (Sinh học/Hóa học/Tự nhiên)"
    ],
    irrigation: [
      "Chú/cô đang sử dụng hệ thống tưới nào? (Thủ công/Tự động/Nhỏ giọt)",
      "Loại đất của chú/cô như thế nào? (Cát/Thịt/Sét)",
      "Chú/cô muốn tiết kiệm nước hay tối ưu hiệu quả?"
    ],
    fertilizer: [
      "Chú/cô đang sử dụng loại phân nào? (Hữu cơ/Vô cơ/Vi sinh)",
      "Cây trồng của chú/cô đang ở giai đoạn nào?",
      "Chú/cô có muốn cháu hướng dẫn cách tự làm phân bón không?"
    ],
    seeds: [
      "Chú/cô muốn trồng cây gì? (Rau, hoa, cây ăn quả...)",
      "Điều kiện khí hậu và đất đai của chú/cô như thế nào?",
      "Chú/cô có ưu tiên về năng suất hay chất lượng?"
    ],
    melon: [
      "Chú/cô muốn biết về khía cạnh nào của trồng dưa lưới? (Thời vụ/Chuẩn bị đất/Gieo hạt/Chăm sóc/Thụ phấn/Làm giàn/Phòng bệnh/Thu hoạch)",
      "Chú/cô trồng ở miền nào? (Nam/Bắc/Trung) để cháu đưa ra khuyến nghị phù hợp",
      "Chú/cô trồng quy mô nào? (Tại nhà/Thương mại) để cháu hướng dẫn chi tiết"
    ],
    durian: [
      "Chú/cô muốn biết về khía cạnh nào? (Bón phân ra hoa/Chăm sóc/Phòng bệnh)",
      "Cây sầu riêng của chú/cô bao nhiêu tuổi?",
      "Chú/cô có muốn cháu nhắc nhở lịch bón phân không?"
    ],
    coffee: [
      "Chú/cô muốn cháu nhắc nhở vào thời gian nào? (Hàng tuần/Hàng tháng)",
      "Chú/cô có muốn biết lịch bón phân chi tiết không?",
      "Chú/cô có muốn cháu nhắc nhở kiểm tra sâu bệnh không?"
    ],
    price: [
      "Chú/cô muốn biết giá nông sản nào? (Lúa/Trái cây/Cà phê)",
      "Chú/cô muốn biết giá ở vùng nào?",
      "Chú/cô có muốn cháu dự báo xu hướng giá không?"
    ]
  };

  useEffect(() => {
    // Welcome message with smart suggestions
    setTimeout(() => {
      addMessage("Chào chú/cô! Cháu là NôngTrí, chuyên gia nông nghiệp đây ạ! 🌱\n\nCháu có thể giúp chú/cô với:\n• Thông tin thời tiết chi tiết\n• Kỹ thuật trồng trọt, chăn nuôi\n• Phòng trừ sâu bệnh hiệu quả\n• Dự báo giá nông sản\n• Nhắc nhở công việc hàng ngày\n\nChú/cô cần cháu hỗ trợ gì hôm nay ạ?", false, smartSuggestions);
    }, 1000);
  }, []);

  const addMessage = (text: string, isUser: boolean, suggestions?: Suggestion[], followUp?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      suggestions,
      followUpQuestions: followUp
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateDetailedResponse = (userInput: string, context: ConversationContext): string => {
    const input = userInput.toLowerCase();
    let response = '';
    let followUp: string[] = [];
    
    // Determine the main topic
    if (input.includes('thời tiết') || input.includes('nhiệt độ') || input.includes('mưa')) {
      if (context.followUpStage === 0) {
        response = aiResponses.weather.basic;
        followUp = followUpQuestions.weather;
        setConversationContext(prev => ({ ...prev, currentTopic: 'weather', followUpStage: 1 }));
      } else {
        response = generateWeatherDetailedResponse(input, context);
      }
    } else if (input.includes('lúa') || input.includes('trồng lúa') || input.includes('miền tây')) {
      if (context.followUpStage === 0) {
        response = aiResponses.rice.basic;
        followUp = followUpQuestions.rice;
        setConversationContext(prev => ({ ...prev, currentTopic: 'rice', followUpStage: 1 }));
      } else {
        response = generateRiceDetailedResponse(input, context);
      }
    } else if (input.includes('ớt') || input.includes('vàng lá') || input.includes('rụng trái')) {
      if (context.followUpStage === 0) {
        response = aiResponses.chili.basic;
        followUp = followUpQuestions.chili;
        setConversationContext(prev => ({ ...prev, currentTopic: 'chili', followUpStage: 1 }));
      } else {
        response = generateChiliDetailedResponse(input, context);
      }
    } else if (input.includes('gà') || input.includes('thả vườn') || input.includes('tiêu chảy')) {
      if (context.followUpStage === 0) {
        response = aiResponses.chicken.basic;
        followUp = followUpQuestions.chicken;
        setConversationContext(prev => ({ ...prev, currentTopic: 'chicken', followUpStage: 1 }));
      } else {
        response = generateChickenDetailedResponse(input, context);
      }
    } else if (input.includes('sầu riêng') || input.includes('ra hoa')) {
      if (context.followUpStage === 0) {
        response = aiResponses.durian.basic;
        followUp = followUpQuestions.durian;
        setConversationContext(prev => ({ ...prev, currentTopic: 'durian', followUpStage: 1 }));
      } else {
        response = generateDurianDetailedResponse(input, context);
      }
    } else if (input.includes('cà phê') || input.includes('nhắc nhở')) {
      if (context.followUpStage === 0) {
        response = aiResponses.coffee.basic;
        followUp = followUpQuestions.coffee;
        setConversationContext(prev => ({ ...prev, currentTopic: 'coffee', followUpStage: 1 }));
      } else {
        response = generateCoffeeDetailedResponse(input, context);
      }
    } else if (input.includes('giá') || input.includes('ir50404') || input.includes('long an')) {
      if (context.followUpStage === 0) {
        response = aiResponses.price.basic;
        followUp = followUpQuestions.price;
        setConversationContext(prev => ({ ...prev, currentTopic: 'price', followUpStage: 1 }));
      } else {
        response = generatePriceDetailedResponse(input, context);
      }
    } else if (input.includes('trồng') || input.includes('canh tác') || input.includes('năng suất')) {
      if (context.followUpStage === 0) {
        response = aiResponses.farming.basic;
        followUp = followUpQuestions.farming;
        setConversationContext(prev => ({ ...prev, currentTopic: 'farming', followUpStage: 1 }));
      } else {
        response = generateFarmingDetailedResponse(input, context);
      }
    } else if (input.includes('sâu') || input.includes('bệnh') || input.includes('thuốc')) {
      if (context.followUpStage === 0) {
        response = aiResponses.pest.basic;
        followUp = followUpQuestions.pest;
        setConversationContext(prev => ({ ...prev, currentTopic: 'pest', followUpStage: 1 }));
      } else {
        response = generatePestDetailedResponse(input, context);
      }
    } else if (input.includes('tưới') || input.includes('nước')) {
      if (context.followUpStage === 0) {
        response = "Dạ, tưới nước là yếu tố quan trọng nhất trong canh tác. Cháu sẽ hướng dẫn chú/cô kỹ thuật tưới nước thông minh và hiệu quả ạ.";
        followUp = followUpQuestions.irrigation;
        setConversationContext(prev => ({ ...prev, currentTopic: 'irrigation', followUpStage: 1 }));
      } else {
        response = generateIrrigationDetailedResponse(input, context);
      }
    } else if (input.includes('phân') || input.includes('bón')) {
      if (context.followUpStage === 0) {
        response = "Dạ, bón phân đúng cách giúp cây trồng phát triển tốt và cho năng suất cao. Cháu sẽ hướng dẫn chú/cô chi tiết ạ.";
        followUp = followUpQuestions.fertilizer;
        setConversationContext(prev => ({ ...prev, currentTopic: 'fertilizer', followUpStage: 1 }));
      } else {
        response = generateFertilizerDetailedResponse(input, context);
      }
    } else if (input.includes('giống') || input.includes('hạt')) {
      if (context.followUpStage === 0) {
        response = "Dạ, chọn giống cây trồng phù hợp là bước đầu tiên quan trọng. Cháu sẽ tư vấn cho chú/cô ạ.";
        followUp = followUpQuestions.seeds;
        setConversationContext(prev => ({ ...prev, currentTopic: 'seeds', followUpStage: 1 }));
      } else {
        response = generateSeedsDetailedResponse(input, context);
      }
    } else if (input.includes('dưa lưới') || input.includes('dưa') || input.includes('melon')) {
      if (context.followUpStage === 0) {
        response = aiResponses.melon.basic;
        followUp = followUpQuestions.melon;
        setConversationContext(prev => ({ ...prev, currentTopic: 'melon', followUpStage: 1 }));
      } else {
        response = generateMelonDetailedResponse(input, context);
      }
    } else {
      response = "Dạ, cảm ơn câu hỏi của chú/cô! Cháu đang học hỏi thêm để có thể hỗ trợ chú/cô tốt hơn. Chú/cô có thể chọn một chủ đề từ gợi ý bên dưới hoặc hỏi cháu về thời tiết, kỹ thuật canh tác, chăn nuôi, hoặc phòng trừ sâu bệnh ạ.";
      setConversationContext(prev => ({ ...prev, followUpStage: 0 }));
    }

    return response;
  };

  const generateWeatherDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('sáng') || input.includes('buổi sáng')) {
      return aiResponses.weather.detailed.morning;
    } else if (input.includes('chiều') || input.includes('buổi chiều')) {
      return aiResponses.weather.detailed.afternoon;
    } else if (input.includes('tối') || input.includes('buổi tối')) {
      return aiResponses.weather.detailed.evening;
    } else {
      return `Dựa trên thông tin bạn cung cấp, đây là khuyến nghị chi tiết:\n\n${aiResponses.weather.recommendations.join('\n')}\n\nBạn có muốn biết thêm về thời điểm tưới nước hoặc bón phân phù hợp không?`;
    }
  };

  const generateFarmingDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('tưới') || input.includes('nước')) {
      return aiResponses.farming.detailed.irrigation;
    } else if (input.includes('phân') || input.includes('bón')) {
      return aiResponses.farming.detailed.fertilization;
    } else if (input.includes('đất') || input.includes('cải thiện')) {
      return aiResponses.farming.detailed.soil;
    } else {
      return `Dựa trên thông tin bạn cung cấp, đây là hướng dẫn chi tiết:\n\n${aiResponses.farming.detailed.irrigation}\n\n${aiResponses.farming.detailed.fertilization}\n\n${aiResponses.farming.detailed.soil}\n\nBạn muốn tôi giải thích thêm về phần nào?`;
    }
  };

  const generatePestDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('phòng') || input.includes('ngừa')) {
      return aiResponses.pest.detailed.prevention;
    } else if (input.includes('sinh học') || input.includes('thuốc')) {
      return aiResponses.pest.detailed.biological;
    } else if (input.includes('xử lý') || input.includes('trị')) {
      return aiResponses.pest.detailed.treatment;
    } else {
      return `Dựa trên thông tin bạn cung cấp, đây là hướng dẫn chi tiết:\n\n${aiResponses.pest.detailed.prevention}\n\n${aiResponses.pest.detailed.biological}\n\n${aiResponses.pest.detailed.treatment}\n\nBạn muốn tôi giải thích thêm về phần nào?`;
    }
  };

  const generateIrrigationDetailedResponse = (input: string, context: ConversationContext): string => {
    return `Dựa trên thông tin bạn cung cấp, đây là hướng dẫn chi tiết về tưới nước:\n\n${aiResponses.farming.detailed.irrigation}\n\nLưu ý quan trọng:\n• Không tưới nước khi trời nắng gắt\n• Tưới đều đặn theo lịch trình\n• Điều chỉnh lượng nước theo loại cây\n• Sử dụng hệ thống tưới thông minh để tiết kiệm`;
  };

  const generateFertilizerDetailedResponse = (input: string, context: ConversationContext): string => {
    return `Dựa trên thông tin bạn cung cấp, đây là hướng dẫn chi tiết về bón phân:\n\n${aiResponses.farming.detailed.fertilization}\n\nLưu ý quan trọng:\n• Bón phân vào buổi chiều mát\n• Tưới nước sau khi bón phân\n• Không bón quá nhiều để tránh cháy rễ\n• Sử dụng phân hữu cơ để cải thiện đất`;
  };

  const generateSeedsDetailedResponse = (input: string, context: ConversationContext): string => {
    return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chọn giống cây trồng:\n\n🌱 Chọn giống theo mùa vụ:\n• Mùa xuân: Rau cải, đậu, cà chua\n• Mùa hè: Dưa hấu, bí, ớt\n• Mùa thu: Cải bắp, súp lơ, hành\n\n🌾 Chọn giống theo điều kiện:\n• Đất cát: Cây có rễ sâu\n• Đất thịt: Hầu hết các loại cây\n• Đất sét: Cây chịu úng tốt\n\n💡 Lưu ý: Chọn giống có nguồn gốc rõ ràng, kháng bệnh tốt`;
  };

  const generateRiceDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('bón phân') || input.includes('phân')) {
      return aiResponses.rice.detailed.fertilizer;
    } else if (input.includes('chăm sóc') || input.includes('tưới')) {
      return aiResponses.rice.detailed.care;
    } else if (input.includes('vụ') || input.includes('mùa')) {
      return aiResponses.rice.detailed.season;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về trồng lúa miền Tây:\n\n${aiResponses.rice.detailed.season}\n\n${aiResponses.rice.detailed.fertilizer}\n\n${aiResponses.rice.detailed.care}\n\n💡 Lưu ý: Chú/cô nên theo dõi thời tiết và điều chỉnh lịch bón phân cho phù hợp ạ.`;
    }
  };

  const generateChiliDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('bệnh') || input.includes('nấm')) {
      return aiResponses.chili.detailed.disease;
    } else if (input.includes('xử lý') || input.includes('trị')) {
      return aiResponses.chili.detailed.treatment;
    } else if (input.includes('dinh dưỡng') || input.includes('phân')) {
      return aiResponses.chili.detailed.nutrition;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về xử lý cây ớt:\n\n${aiResponses.chili.detailed.disease}\n\n${aiResponses.chili.detailed.treatment}\n\n${aiResponses.chili.detailed.nutrition}\n\n💡 Lưu ý: Chú/cô nên cách ly cây bị bệnh và vệ sinh vườn thường xuyên ạ.`;
    }
  };

  const generateChickenDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('bệnh') || input.includes('dịch')) {
      return aiResponses.chicken.detailed.disease;
    } else if (input.includes('xử lý') || input.includes('trị')) {
      return aiResponses.chicken.detailed.treatment;
    } else if (input.includes('phòng') || input.includes('ngừa')) {
      return aiResponses.chicken.detailed.prevention;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về chăn nuôi gà:\n\n${aiResponses.chicken.detailed.disease}\n\n${aiResponses.chicken.detailed.treatment}\n\n${aiResponses.chicken.detailed.prevention}\n\n💡 Lưu ý: Chú/cô nên cách ly gà bị bệnh và vệ sinh chuồng trại sạch sẽ ạ.`;
    }
  };

  const generateDurianDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('ra hoa') || input.includes('hoa')) {
      return aiResponses.durian.detailed.flowering;
    } else if (input.includes('chăm sóc') || input.includes('tỉa')) {
      return aiResponses.durian.detailed.care;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về cây sầu riêng:\n\n${aiResponses.durian.detailed.flowering}\n\n${aiResponses.durian.detailed.care}\n\n💡 Lưu ý: Chú/cô nên bón phân đúng thời điểm và phòng bệnh thán thư ạ.`;
    }
  };

  const generateCoffeeDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('lịch') || input.includes('thời gian')) {
      return aiResponses.coffee.detailed.schedule;
    } else if (input.includes('nhắc') || input.includes('nhớ')) {
      return aiResponses.coffee.detailed.reminder;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về cây cà phê:\n\n${aiResponses.coffee.detailed.schedule}\n\n${aiResponses.coffee.detailed.reminder}\n\n💡 Lưu ý: Cháu sẽ nhắc chú/cô bón phân vào sáng thứ Bảy hàng tuần ạ.`;
    }
  };

  const generatePriceDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('lúa') || input.includes('ir50404')) {
      return aiResponses.price.detailed.rice;
    } else if (input.includes('trái cây') || input.includes('xoài') || input.includes('sầu riêng')) {
      return aiResponses.price.detailed.fruit;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là thông tin giá nông sản:\n\n${aiResponses.price.detailed.rice}\n\n${aiResponses.price.detailed.fruit}\n\n💡 Lưu ý: Giá có thể thay đổi theo thời gian và địa điểm, chú/cô nên cập nhật thường xuyên ạ.`;
    }
  };

  const generateMelonDetailedResponse = (input: string, context: ConversationContext): string => {
    if (input.includes('thời vụ') || input.includes('mùa')) {
      return aiResponses.melon.detailed.season;
    } else if (input.includes('đất') || input.includes('chuẩn bị')) {
      return aiResponses.melon.detailed.soil;
    } else if (input.includes('gieo') || input.includes('hạt') || input.includes('ươm')) {
      return aiResponses.melon.detailed.seeding;
    } else if (input.includes('chăm sóc') || input.includes('tưới') || input.includes('phân')) {
      return aiResponses.melon.detailed.care;
    } else if (input.includes('thụ phấn') || input.includes('hoa')) {
      return aiResponses.melon.detailed.pollination;
    } else if (input.includes('giàn') || input.includes('leo')) {
      return aiResponses.melon.detailed.trellis;
    } else if (input.includes('bệnh') || input.includes('sâu') || input.includes('phòng')) {
      return aiResponses.melon.detailed.disease;
    } else if (input.includes('thu hoạch') || input.includes('hái')) {
      return aiResponses.melon.detailed.harvest;
    } else if (input.includes('nam') || input.includes('miền nam')) {
      return `Dựa trên thông tin chú/cô cung cấp về miền Nam, đây là hướng dẫn chi tiết:\n\n${aiResponses.melon.detailed.season}\n\n${aiResponses.melon.detailed.soil}\n\n${aiResponses.melon.detailed.care}\n\n${aiResponses.melon.detailed.pollination}\n\n${aiResponses.melon.detailed.trellis}\n\n${aiResponses.melon.detailed.disease}\n\n${aiResponses.melon.detailed.harvest}\n\n💡 Lưu ý đặc biệt cho miền Nam:\n• Trồng mùa khô (tháng 11-4) để tránh mưa nhiều\n• Làm giàn cao để tránh úng nước\n• Sử dụng màng phủ để giữ ẩm\n• Thụ phấn sớm để tránh mưa`;
    } else if (input.includes('bắc') || input.includes('miền bắc')) {
      return `Dựa trên thông tin chú/cô cung cấp về miền Bắc, đây là hướng dẫn chi tiết:\n\n${aiResponses.melon.detailed.season}\n\n${aiResponses.melon.detailed.soil}\n\n${aiResponses.melon.detailed.care}\n\n${aiResponses.melon.detailed.pollination}\n\n${aiResponses.melon.detailed.trellis}\n\n${aiResponses.melon.detailed.disease}\n\n${aiResponses.melon.detailed.harvest}\n\n💡 Lưu ý đặc biệt cho miền Bắc:\n• Trồng 2 vụ: Xuân (tháng 2-4) và Thu (tháng 8-10)\n• Che chắn khi trời lạnh\n• Tăng cường phân bón khi thời tiết thuận lợi\n• Thụ phấn vào buổi sáng ấm áp`;
    } else if (input.includes('nhà') || input.includes('tại nhà')) {
      return `Dựa trên thông tin chú/cô cung cấp về trồng tại nhà, đây là hướng dẫn chi tiết:\n\n${aiResponses.melon.detailed.soil}\n\n${aiResponses.melon.detailed.seeding}\n\n${aiResponses.melon.detailed.care}\n\n${aiResponses.melon.detailed.pollination}\n\n${aiResponses.melon.detailed.trellis}\n\n${aiResponses.melon.detailed.disease}\n\n${aiResponses.melon.detailed.harvest}\n\n🏠 Lưu ý đặc biệt cho trồng tại nhà:\n• Sử dụng thùng xốp, chậu lớn (tối thiểu 30cm)\n• Đặt ở nơi có nắng 6-8h/ngày\n• Tưới nước đều đặn, không để úng\n• Thụ phấn bằng tay để đảm bảo đậu trái\n• Làm giàn đơn giản bằng dây thép`;
    } else if (input.includes('thương mại') || input.includes('kinh doanh')) {
      return `Dựa trên thông tin chú/cô cung cấp về trồng thương mại, đây là hướng dẫn chi tiết:\n\n${aiResponses.melon.detailed.season}\n\n${aiResponses.melon.detailed.soil}\n\n${aiResponses.melon.detailed.seeding}\n\n${aiResponses.melon.detailed.care}\n\n${aiResponses.melon.detailed.pollination}\n\n${aiResponses.melon.detailed.trellis}\n\n${aiResponses.melon.detailed.disease}\n\n${aiResponses.melon.detailed.harvest}\n\n💰 Lưu ý đặc biệt cho trồng thương mại:\n• Đầu tư hệ thống tưới tự động\n• Sử dụng màng phủ để giảm cỏ dại\n• Bón phân theo lịch trình nghiêm ngặt\n• Thụ phấn đồng loạt để thu hoạch tập trung\n• Đầu tư nhà lưới để tránh mưa, sâu bệnh\n• Năng suất dự kiến: 15-20 tấn/ha`;
    } else {
      return `Dựa trên thông tin chú/cô cung cấp, đây là hướng dẫn chi tiết về trồng dưa lưới:\n\n${aiResponses.melon.detailed.season}\n\n${aiResponses.melon.detailed.soil}\n\n${aiResponses.melon.detailed.seeding}\n\n${aiResponses.melon.detailed.care}\n\n${aiResponses.melon.detailed.pollination}\n\n${aiResponses.melon.detailed.trellis}\n\n${aiResponses.melon.detailed.disease}\n\n${aiResponses.melon.detailed.harvest}\n\n💡 Mẹo quan trọng:\n${aiResponses.melon.tips.join('\n')}\n\nChú/cô muốn cháu giải thích thêm về phần nào ạ?`;
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    addMessage(suggestion.text, true);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateDetailedResponse(suggestion.text, conversationContext);
      const followUp = followUpQuestions[suggestion.category as keyof typeof followUpQuestions] || [];
      addMessage(response, false, undefined, followUp);
      setIsTyping(false);
    }, 1500);
  };

  const handleFollowUpClick = (question: string) => {
    addMessage(question, true);
    setInputText('');
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateDetailedResponse(question, conversationContext);
      addMessage(response, false);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      addMessage(inputText, true);
      setInputText('');
      setIsTyping(true);
      
      setTimeout(() => {
        const response = generateDetailedResponse(inputText, conversationContext);
        addMessage(response, false);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">NôngTrí AI</h1>
              <p className="text-sm text-gray-600">Chuyên gia nông nghiệp thông minh</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weather Dashboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Sun className="w-5 h-5 text-yellow-500 mr-2" />
                Thời tiết hôm nay
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-gray-600">Nhiệt độ</span>
                  </div>
                  <span className="font-semibold text-lg">{weatherData.temperature}°C</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CloudRain className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-600">Độ ẩm</span>
                  </div>
                  <span className="font-semibold text-lg">{weatherData.humidity}%</span>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <strong>Khuyến nghị:</strong> Thời tiết thuận lợi cho việc tưới nước và bón phân
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                Gợi ý thông minh
              </h3>
              <div className="space-y-3">
                {smartSuggestions.map((suggestion) => (
                <button 
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 hover:from-blue-100 hover:to-green-100 transition-all duration-200 border border-blue-100 hover:border-blue-200"
                >
                    <div className="flex items-center justify-between">
                  <div className="flex items-center">
                        <span className="text-lg mr-2">{suggestion.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{suggestion.text}</span>
                  </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">NôngTrí Assistant</h3>
                    <p className="text-sm text-gray-500">Sẵn sàng hỗ trợ chú/cô 24/7</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                  <div
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.suggestions && !message.isUser && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Gợi ý câu hỏi:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
                            >
                              {suggestion.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Follow-up Questions */}
                    {message.followUpQuestions && !message.isUser && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Để tôi có thể giúp bạn tốt hơn:</p>
                        <div className="space-y-2">
                          {message.followUpQuestions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleFollowUpClick(question)}
                              className="w-full text-left p-2 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100 transition-colors border border-green-200"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-1">
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
                    placeholder="Nhập câu hỏi của chú/cô..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App; 