
import XLSX from 'xlsx';
import fs from 'fs';

const filePath = '/Users/oui/Wutcharin/2566_election_result.xlsx';
const outputPath = '/Users/oui/Wutcharin/src/data/election-2023.json';

// Party Metadata (Colors, Leaders, Slogans, Logos)
const PARTY_INFO = {
    "ก้าวไกล": {
        color: "#F47524",
        name_en: "Move Forward",
        name_th: "ก้าวไกล",
        leader: "Pita Limjaroenrat",
        slogan: "Good politics, good living, good future",
        slogan_th: "กาก้าวไกล ประเทศไทยไม่เหมือนเดิม",
        logo: "/logos/mfp.png"
    },
    "เพื่อไทย": {
        color: "#E30613",
        name_en: "Pheu Thai",
        name_th: "เพื่อไทย",
        leader: "Paetongtarn Shinawatra",
        slogan: "Think big, act smart for all Thais",
        slogan_th: "คิดใหญ่ ทำเป็น เพื่อไทยทุกคน",
        logo: "/logos/pt.png"
    },
    "ภูมิใจไทย": {
        color: "#003C71",
        name_en: "Bhumjaithai",
        name_th: "ภูมิใจไทย",
        leader: "Anutin Charnvirakul",
        slogan: "Said and done",
        slogan_th: "พูดแล้วทำ",
        logo: "/logos/bjt.jpg"
    },
    "พลังประชารัฐ": {
        color: "#1F2937",
        name_en: "Palang Pracharath",
        name_th: "พลังประชารัฐ",
        leader: "Prawit Wongsuwan",
        slogan: "Overcoming conflict",
        slogan_th: "ก้าวข้ามความขัดแย้ง ขจัดทุกปัญหา พัฒนาทุกพื้นที่",
        logo: "/logos/pprp.png"
    },
    "รวมไทยสร้างชาติ": {
        color: "#2563EB",
        name_en: "United Thai Nation",
        name_th: "รวมไทยสร้างชาติ",
        leader: "Prayut Chan-o-cha",
        slogan: "Done, doing and will continue",
        slogan_th: "ทำแล้ว ทำอยู่ ทำต่อ",
        logo: "/logos/utn.png"
    },
    "ประชาธิปัตย์": {
        color: "#40C0FF",
        name_en: "Democrat",
        name_th: "ประชาธิปัตย์",
        leader: "Jurin Laksanawisit",
        slogan: "Creating jobs, generating revenue",
        slogan_th: "ทำได้ไว ทำได้จริง",
        logo: "/logos/dem.png"
    },
    "ชาติไทยพัฒนา": {
        color: "#FF69B4",
        name_en: "Chart Thai Pattana",
        name_th: "ชาติไทยพัฒนา",
        leader: "Varawut Silpa-archa",
        slogan: "Wow Thailand",
        slogan_th: "รับฟัง ทำจริง",
        logo: "/logos/ctp.png"
    },
    "ประชาชาติ": {
        color: "#A0522D",
        name_en: "Prachachat",
        name_th: "ประชาชาติ",
        leader: "Wan Muhamad Noor Matha",
        slogan: "Multicultural society",
        slogan_th: "สังคมพหุวัฒนธรรม",
        logo: "/logos/pcc.png"
    },
    "ไทยสร้างไทย": {
        color: "#0000FF",
        name_en: "Thai Sang Thai",
        name_th: "ไทยสร้างไทย",
        leader: "Sudarat Keyuraphan",
        slogan: "Fight for the little ones",
        slogan_th: "สู้เพื่อคนตัวเล็ก",
        logo: "/logos/tst.png"
    },
    "เสรีรวมไทย": {
        color: "#FFD700",
        name_en: "Seri Ruam Thai",
        name_th: "เสรีรวมไทย",
        leader: "Seripisut Temiyavet",
        slogan: "Dare to change",
        slogan_th: "กล้าชนเพื่อคนไทย",
        logo: "/logos/srt.png"
    },
    "ชาติพัฒนากล้า": {
        color: "#FF9900",
        name_en: "Chart Pattana Kla",
        name_th: "ชาติพัฒนากล้า",
        leader: "Korn Chatikavanij",
        slogan: "Dare to think, dare to do",
        slogan_th: "งานดี มีเงิน ของไม่แพง",
        logo: "/logos/cpk.png"
    },
    "เพื่อไทรวมพลัง": {
        color: "#808080",
        name_en: "Pheu Thai Ruam Palang",
        name_th: "เพื่อไทรวมพลัง",
        leader: "Wasawat Poungporn",
        slogan: "-",
        slogan_th: "-",
        logo: "/logos/ptrp.jpg"
    },
    "ไทยภักดี": { color: "#FFD700", name_en: "Thai Pakdee", name_th: "ไทยภักดี", leader: "Warong Dechgitvigrom", slogan: "Protect the Monarchy", slogan_th: "ปกป้องสถาบัน", logo: "" },
    "คลองไทย": { color: "#008080", name_en: "Klong Thai", name_th: "คลองไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "รักษ์ผืนป่าประเทศไทย": { color: "#228B22", name_en: "Thai Forest Conservation", name_th: "รักษ์ผืนป่าประเทศไทย", leader: "Damrong Pidech", slogan: "-", slogan_th: "-", logo: "" },
    "เพื่อชาติไทย": { color: "#4682B4", name_en: "Pheu Chart Thai", name_th: "เพื่อชาติไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังธรรมใหม่": { color: "#FFA500", name_en: "New Palang Dharma", name_th: "พลังธรรมใหม่", leader: "Rawee Machamadon", slogan: "-", slogan_th: "-", logo: "" },
    "เส้นด้าย": { color: "#800080", name_en: "Zendai", name_th: "เส้นด้าย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ทางเลือกใหม่": { color: "#FF4500", name_en: "New Alternative", name_th: "ทางเลือกใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เพื่อชาติ": { color: "#00CED1", name_en: "Pheu Chart", name_th: "เพื่อชาติ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยศรีวิไลย์": { color: "#A52A2A", name_en: "Thai Sriwilai", name_th: "ไทยศรีวิไลย์", leader: "Mongkolkit Suksintharanon", slogan: "-", slogan_th: "-", logo: "" },
    "รวมแผ่นดิน": { color: "#2E8B57", name_en: "Ruam Phaen Din", name_th: "รวมแผ่นดิน", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยชนะ": { color: "#DAA520", name_en: "Thai Chana", name_th: "ไทยชนะ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ประชาไทย": { color: "#B8860B", name_en: "Pracha Thai", name_th: "ประชาไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ประชากรไทย": { color: "#000080", name_en: "Thai Citizen", name_th: "ประชากรไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "แนวทางใหม่": { color: "#FF6347", name_en: "New Way", name_th: "แนวทางใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เปลี่ยนอนาคต": { color: "#4B0082", name_en: "Change Future", name_th: "เปลี่ยนอนาคต", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังสังคมใหม่": { color: "#FF1493", name_en: "New Social Power", name_th: "พลังสังคมใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยสมาร์ท": { color: "#00FA9A", name_en: "Thai Smart", name_th: "ไทยสมาร์ท", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "อนาคตไทย": { color: "#DC143C", name_en: "Thai Future", name_th: "อนาคตไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เสมอภาค": { color: "#F0E68C", name_en: "Equality", name_th: "เสมอภาค", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยธรรม": { color: "#D2691E", name_en: "Thai Dharma", name_th: "ไทยธรรม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ราษฎร์วิถี": { color: "#8B4513", name_en: "Ratsadon Withi", name_th: "ราษฎร์วิถี", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ภราดรภาพ": { color: "#708090", name_en: "Pharadonphap", name_th: "ภราดรภาพ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เป็นธรรม": { color: "#000000", name_en: "Fair Party", name_th: "เป็นธรรม", leader: "Pitipong Temcharoen", slogan: "-", slogan_th: "-", logo: "/logos/fair.png" },
    "พลังสังคม": { color: "#2F4F4F", name_en: "Social Power", name_th: "พลังสังคม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เปลี่ยน": { color: "#800000", name_en: "Change", name_th: "เปลี่ยน", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ครูไทยเพื่อประชาชน": { color: "#556B2F", name_en: "Thai Teachers", name_th: "ครูไทยเพื่อประชาชน", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังปวงชนไทย": { color: "#8B008B", name_en: "Thai People Power", name_th: "พลังปวงชนไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยเป็นหนึ่ง": { color: "#9932CC", name_en: "Thai is One", name_th: "ไทยเป็นหนึ่ง", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ใหม่": { color: "#E9967A", name_en: "New", name_th: "ใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ท้องที่ไทย": { color: "#8FBC8F", name_en: "Thai Local", name_th: "ท้องที่ไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "มิติใหม่": { color: "#483D8B", name_en: "New Dimension", name_th: "มิติใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังสหกรณ์": { color: "#20B2AA", name_en: "Cooperative Power", name_th: "พลังสหกรณ์", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ประชาธิปไตยใหม่": { color: "#FF00FF", name_en: "New Democracy", name_th: "ประชาธิปไตยใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "รวมใจไทย": { color: "#7B68EE", name_en: "Ruam Jai Thai", name_th: "รวมใจไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "สังคมประชาธิปไตยไทย": { color: "#6A5ACD", name_en: "Thai Social Democrat", name_th: "สังคมประชาธิปไตยไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "เพื่ออนาคตไทย": { color: "#40E0D0", name_en: "For Thai Future", name_th: "เพื่ออนาคตไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "กรีน": { color: "#00FF00", name_en: "Green", name_th: "กรีน", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ความหวังใหม่": { color: "#FFFF00", name_en: "New Hope", name_th: "ความหวังใหม่", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลัง": { color: "#FF4500", name_en: "Power", name_th: "พลัง", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังไทยรักชาติ": { color: "#C71585", name_en: "Thai Power Love Nation", name_th: "พลังไทยรักชาติ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังเพื่อไทย": { color: "#191970", name_en: "Power For Thai", name_th: "พลังเพื่อไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังบูรพา": { color: "#B0C4DE", name_en: "Burapha Power", name_th: "พลังบูรพา", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "แรงงานสร้างชาติ": { color: "#FF8C00", name_en: "Labor Nation Building", name_th: "แรงงานสร้างชาติ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ภาคีเครือข่ายไทย": { color: "#696969", name_en: "Thai Network Party", name_th: "ภาคีเครือข่ายไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ช่วยชาติ": { color: "#A9A9A9", name_en: "Help Nation", name_th: "ช่วยชาติ", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยพร้อม": { color: "#00008B", name_en: "Thai Ready", name_th: "ไทยพร้อม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังประชาธิปไตย": { color: "#006400", name_en: "Democratic Power", name_th: "พลังประชาธิปไตย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "รักษ์ธรรม": { color: "#BDB76B", name_en: "Rak Dharma", name_th: "รักษ์ธรรม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ชาติรุ่งเรือง": { color: "#8B0000", name_en: "Nation Prosperous", name_th: "ชาติรุ่งเรือง", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ประชาภิวัฒน์": { color: "#5F9EA0", name_en: "Pracha Piwat", name_th: "ประชาภิวัฒน์", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "แผ่นดินธรรม": { color: "#D2B48C", name_en: "Land of Dharma", name_th: "แผ่นดินธรรม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "รวมพลัง": { color: "#BC8F8F", name_en: "Action Coalition", name_th: "รวมพลัง", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ประชาสามัคคี": { color: "#F4A460", name_en: "Pracha Samakkhi", name_th: "ประชาสามัคคี", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ถิ่นกาขาวชาววิไล": { color: "#DA70D6", name_en: "Thin Ka Khao", name_th: "ถิ่นกาขาวชาววิไล", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "พลังสยาม": { color: "#EE82EE", name_en: "Siam Power", name_th: "พลังสยาม", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยรวมไทย": { color: "#9370DB", name_en: "Thai Ruam Thai", name_th: "ไทยรวมไทย", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "ไทยก้าวหน้า": { color: "#3CB371", name_en: "Thai Progress", name_th: "ไทยก้าวหน้า", leader: "-", slogan: "-", slogan_th: "-", logo: "" },
    "อื่นๆ": {
        color: "#9CA3AF",
        name_en: "Others",
        name_th: "อื่นๆ",
        leader: "-",
        slogan: "-",
        slogan_th: "-",
        logo: ""
    }
};

const REGION_MAPPING = {
    "เชียงราย": "North", "เชียงใหม่": "North", "น่าน": "North", "พะเยา": "North", "แพร่": "North", "แม่ฮ่องสอน": "North", "ลำปาง": "North", "ลำพูน": "North", "อุตรดิตถ์": "North",
    "กาฬสินธุ์": "Northeast", "ขอนแก่น": "Northeast", "ชัยภูมิ": "Northeast", "นครพนม": "Northeast", "นครราชสีมา": "Northeast", "บึงกาฬ": "Northeast", "บุรีรัมย์": "Northeast", "มหาสารคาม": "Northeast", "มุกดาหาร": "Northeast", "ยโสธร": "Northeast", "ร้อยเอ็ด": "Northeast", "เลย": "Northeast", "ศรีสะเกษ": "Northeast", "สกลนคร": "Northeast", "สุรินทร์": "Northeast", "หนองคาย": "Northeast", "หนองบัวลำภู": "Northeast", "อำนาจเจริญ": "Northeast", "อุดรธานี": "Northeast", "อุบลราชธานี": "Northeast",
    "กำแพงเพชร": "Central", "ชัยนาท": "Central", "นครนายก": "Central", "นครปฐม": "Central", "นครสวรรค์": "Central", "นนทบุรี": "Central", "ปทุมธานี": "Central", "พระนครศรีอยุธยา": "Central", "พิจิตร": "Central", "พิษณุโลก": "Central", "เพชรบูรณ์": "Central", "ลพบุรี": "Central", "สมุทรปราการ": "Central", "สมุทรสงคราม": "Central", "สมุทรสาคร": "Central", "สระบุรี": "Central", "สิงห์บุรี": "Central", "สุโขทัย": "Central", "สุพรรณบุรี": "Central", "อ่างทอง": "Central", "อุทัยธานี": "Central",
    "จันทบุรี": "East", "ฉะเชิงเทรา": "East", "ชลบุรี": "East", "ตราด": "East", "ปราจีนบุรี": "East", "ระยอง": "East", "สระแก้ว": "East",
    "กาญจนบุรี": "West", "ตาก": "West", "ประจวบคีรีขันธ์": "West", "เพชรบุรี": "West", "ราชบุรี": "West",
    "กระบี่": "South", "ชุมพร": "South", "ตรัง": "South", "นครศรีธรรมราช": "South", "นราธิวาส": "South", "ปัตตานี": "South", "พังงา": "South", "พัทลุง": "South", "ภูเก็ต": "South", "ยะลา": "South", "ระนอง": "South", "สงขลา": "South", "สตูล": "South", "สุราษฎร์ธานี": "South",
    "กรุงเทพมหานคร": "Bangkok"
};

// Placeholder for GRID_MAPPING. Actual values would be defined elsewhere or dynamically generated.
const GRID_MAPPING = {
    "กรุงเทพมหานคร": { r: 0, c: 0 }, "นนทบุรี": { r: 0, c: 1 }, "ปทุมธานี": { r: 0, c: 2 }, "สมุทรปราการ": { r: 0, c: 3 },
    "สมุทรสาคร": { r: 1, c: 0 }, "สมุทรสงคราม": { r: 1, c: 1 }, "นครปฐม": { r: 1, c: 2 }, "ราชบุรี": { r: 1, c: 3 },
    "กาญจนบุรี": { r: 2, c: 0 }, "สุพรรณบุรี": { r: 2, c: 1 }, "พระนครศรีอยุธยา": { r: 2, c: 2 }, "สระบุรี": { r: 2, c: 3 },
    "ลพบุรี": { r: 3, c: 0 }, "สิงห์บุรี": { r: 3, c: 1 }, "อ่างทอง": { r: 3, c: 2 }, "ชัยนาท": { r: 3, c: 3 },
    "นครนายก": { r: 4, c: 0 }, "ฉะเชิงเทรา": { r: 4, c: 1 }, "ปราจีนบุรี": { r: 4, c: 2 }, "สระแก้ว": { r: 4, c: 3 },
    "ชลบุรี": { r: 5, c: 0 }, "ระยอง": { r: 5, c: 1 }, "จันทบุรี": { r: 5, c: 2 }, "ตราด": { r: 5, c: 3 },
    "เพชรบุรี": { r: 6, c: 0 }, "ประจวบคีรีขันธ์": { r: 6, c: 1 }, "ชุมพร": { r: 6, c: 2 }, "ระนอง": { r: 6, c: 3 },
    "สุราษฎร์ธานี": { r: 7, c: 0 }, "พังงา": { r: 7, c: 1 }, "ภูเก็ต": { r: 7, c: 2 }, "กระบี่": { r: 7, c: 3 },
    "นครศรีธรรมราช": { r: 8, c: 0 }, "ตรัง": { r: 8, c: 1 }, "พัทลุง": { r: 8, c: 2 }, "สตูล": { r: 8, c: 3 },
    "สงขลา": { r: 9, c: 0 }, "ปัตตานี": { r: 9, c: 1 }, "ยะลา": { r: 9, c: 2 }, "นราธิวาส": { r: 9, c: 3 },
    "เชียงใหม่": { r: 0, c: 4 }, "เชียงราย": { r: 0, c: 5 }, "ลำปาง": { r: 0, c: 6 }, "ลำพูน": { r: 0, c: 7 },
    "แม่ฮ่องสอน": { r: 1, c: 4 }, "น่าน": { r: 1, c: 5 }, "พะเยา": { r: 1, c: 6 }, "แพร่": { r: 1, c: 7 },
    "อุตรดิตถ์": { r: 2, c: 4 }, "ตาก": { r: 2, c: 5 }, "สุโขทัย": { r: 2, c: 6 }, "พิษณุโลก": { r: 2, c: 7 },
    "พิจิตร": { r: 3, c: 4 }, "กำแพงเพชร": { r: 3, c: 5 }, "เพชรบูรณ์": { r: 3, c: 6 }, "นครสวรรค์": { r: 3, c: 7 },
    "อุทัยธานี": { r: 4, c: 4 }, "อุดรธานี": { r: 4, c: 5 }, "หนองคาย": { r: 4, c: 6 }, "หนองบัวลำภู": { r: 4, c: 7 },
    "เลย": { r: 5, c: 4 }, "ขอนแก่น": { r: 5, c: 5 }, "ชัยภูมิ": { r: 5, c: 6 }, "มหาสารคาม": { r: 5, c: 7 },
    "ร้อยเอ็ด": { r: 6, c: 4 }, "กาฬสินธุ์": { r: 6, c: 5 }, "สกลนคร": { r: 6, c: 6 }, "นครพนม": { r: 6, c: 7 },
    "มุกดาหาร": { r: 7, c: 4 }, "ยโสธร": { r: 7, c: 5 }, "อำนาจเจริญ": { r: 7, c: 6 }, "อุบลราชธานี": { r: 7, c: 7 },
    "ศรีสะเกษ": { r: 8, c: 4 }, "สุรินทร์": { r: 8, c: 5 }, "บุรีรัมย์": { r: 8, c: 6 }, "นครราชสีมา": { r: 8, c: 7 },
    "บึงกาฬ": { r: 9, c: 4 }
};

const getPartyInfo = (thaiName) => {
    if (!thaiName) return PARTY_INFO["อื่นๆ"];
    const cleanedName = thaiName.trim();
    if (PARTY_INFO[cleanedName]) return PARTY_INFO[cleanedName];

    // Fallback: Use Thai name directly instead of "Others" to avoid grouping distinct parties
    return {
        color: "#6B7280", // Default Cool Grey
        name_en: cleanedName,
        name_th: cleanedName,
        leader: "-",
        slogan: "-",
        slogan_th: "-",
        logo: ""
    };
};

const getRegion = (province) => REGION_MAPPING[province] || "Central";
const getGrid = (province) => GRID_MAPPING[province] || { r: 0, c: 0 };

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Headers are on row index 3 (4th row)
    const rawData = XLSX.utils.sheet_to_json(sheet, { range: 3 });

    // Data Structures
    const nationalStats = {
        totalVotes: 0,
        partyStats: {} // { PartyName: { votes: 0, seats: 0 } }
    };

    const provinceData = {}; // { ProvinceName: { totalVotes: 0, partyVotes: { PartyName: votes }, seats: { PartyName: count } } }

    rawData.forEach(row => {
        const province = row['จังหวัด']?.trim();
        const party = row['สังกัดพรรค']?.trim();
        const votes = parseInt(row['คะแนน'] || 0);
        const candidate = row['ชื่อ-ชื่อสกุล']?.trim();
        const district = row['เขต'];

        if (!province || !party) return;

        // Initialize Province Data
        if (!provinceData[province]) {
            provinceData[province] = {
                totalVotes: 0,
                partyVotes: {},
                seats: {},
                districts: {}
            };
        }

        // Initialize District Data
        if (!provinceData[province].districts[district]) {
            provinceData[province].districts[district] = {
                maxVotes: -1,
                winnerParty: null,
                candidates: []
            };
        }

        // Add Candidate to District List
        provinceData[province].districts[district].candidates.push({
            name: candidate,
            party: party,
            votes: votes
        });

        // Update District Winner
        if (votes > provinceData[province].districts[district].maxVotes) {
            provinceData[province].districts[district].maxVotes = votes;
            provinceData[province].districts[district].winnerParty = party;
        }

        // Aggregate Province Votes (Popular Vote)
        provinceData[province].totalVotes += votes;
        provinceData[province].partyVotes[party] = (provinceData[province].partyVotes[party] || 0) + votes;

        // Aggregate National Stats
        nationalStats.totalVotes += votes;
        if (!nationalStats.partyStats[party]) {
            nationalStats.partyStats[party] = { votes: 0, seats: 0 };
        }
        nationalStats.partyStats[party].votes += votes;
    });

    // Calculate Seats based on District Winners
    Object.keys(provinceData).forEach(prov => {
        const districts = provinceData[prov].districts;
        Object.values(districts).forEach(d => {
            if (d.winnerParty) {
                // Increment Province Seat Count
                provinceData[prov].seats[d.winnerParty] = (provinceData[prov].seats[d.winnerParty] || 0) + 1;
                // Increment National Seat Count
                if (nationalStats.partyStats[d.winnerParty]) {
                    nationalStats.partyStats[d.winnerParty].seats += 1;
                }
            }
        });
    });

    // Format Province Data
    const provinces = Object.entries(provinceData).map(([province, pData]) => {
        // Determine Province Winner (by Seats, then Votes)
        let provinceWinner = "อื่นๆ";
        let maxSeats = -1;
        let maxVotes = -1;

        // Check seats first
        const seatParties = Object.keys(pData.seats);
        if (seatParties.length > 0) {
            Object.entries(pData.seats).forEach(([party, seats]) => {
                if (seats > maxSeats) {
                    maxSeats = seats;
                    provinceWinner = party;
                }
            });
        } else {
            // Fallback to votes if no seats (unlikely for general election but possible for partial data)
            Object.entries(pData.partyVotes).forEach(([party, votes]) => {
                if (votes > maxVotes) {
                    maxVotes = votes;
                    provinceWinner = party;
                }
            });
        }

        // All Parties in Province by Votes (No Slice)
        const voteBreakdown = Object.entries(pData.partyVotes)
            .map(([party, votes]) => {
                const info = getPartyInfo(party);
                return {
                    party: info.name_en,
                    name_th: info.name_th,
                    votes,
                    percent: ((votes / pData.totalVotes) * 100).toFixed(1),
                    color: info.color,
                    logo: info.logo
                };
            })
            .sort((a, b) => b.votes - a.votes);

        // Seat Breakdown
        const seatBreakdown = Object.entries(pData.seats)
            .map(([party, seats]) => {
                const info = getPartyInfo(party);
                return {
                    party: info.name_en,
                    name_th: info.name_th,
                    seats,
                    color: info.color,
                    logo: info.logo
                };
            })
            .sort((a, b) => b.seats - a.seats);

        // District Breakdown with Top 5
        const districtDetails = Object.entries(pData.districts)
            .map(([id, dData]) => {
                // Sort candidates by votes
                const sortedCandidates = dData.candidates.sort((a, b) => b.votes - a.votes).slice(0, 5);
                const winner = sortedCandidates[0];
                const winnerInfo = getPartyInfo(winner.party);

                return {
                    id: parseInt(id),
                    winner: winnerInfo.name_en,
                    winner_th: winnerInfo.name_th,
                    party: winnerInfo.name_en,
                    color: winnerInfo.color,
                    votes: winner.votes,
                    logo: winnerInfo.logo,
                    top5: sortedCandidates.map(c => {
                        const pInfo = getPartyInfo(c.party);
                        return {
                            name: c.name,
                            party: pInfo.name_en,
                            party_th: pInfo.name_th,
                            votes: c.votes,
                            color: pInfo.color,
                            logo: pInfo.logo
                        };
                    })
                };
            })
            .sort((a, b) => a.id - b.id);

        const winnerInfo = getPartyInfo(provinceWinner);
        const grid = getGrid(province);

        return {
            province,
            region: getRegion(province),
            grid,
            winner: winnerInfo.name_en,
            totalVotes: pData.totalVotes.toLocaleString(),
            color: winnerInfo.color,
            voteBreakdown,
            seatBreakdown,
            districts: districtDetails
        };
    });

    // Calculate Party List Seats (100 Seats Total) - Simple Proportional
    const TOTAL_PARTY_LIST_SEATS = 100;
    const totalNationalVotes = nationalStats.totalVotes;

    let allocatedPartyListSeats = 0;
    const partyListCandidates = [];

    // First pass: Integer seats
    Object.keys(nationalStats.partyStats).forEach(party => {
        const votes = nationalStats.partyStats[party].votes;
        const rawSeats = (votes / totalNationalVotes) * TOTAL_PARTY_LIST_SEATS;
        const integerSeats = Math.floor(rawSeats);
        const remainder = rawSeats - integerSeats;

        nationalStats.partyStats[party].partyListSeats = integerSeats;
        allocatedPartyListSeats += integerSeats;

        partyListCandidates.push({ party, remainder });
    });

    // Second pass: Distribute remaining seats by largest remainder
    partyListCandidates.sort((a, b) => b.remainder - a.remainder);
    let remainingSeats = TOTAL_PARTY_LIST_SEATS - allocatedPartyListSeats;

    for (let i = 0; i < remainingSeats; i++) {
        const p = partyListCandidates[i];
        if (nationalStats.partyStats[p.party]) {
            nationalStats.partyStats[p.party].partyListSeats += 1;
        }
    }

    // Update Total Seats (Constituency + Party List)
    Object.keys(nationalStats.partyStats).forEach(party => {
        const stats = nationalStats.partyStats[party];
        // Constituency seats were already counted in 'seats' during province processing
        // Let's rename 'seats' to 'constituencySeats' for clarity, or just add them up
        stats.constituencySeats = stats.seats;
        stats.totalSeats = stats.constituencySeats + stats.partyListSeats;
    });

    // Format National Stats
    const topParties = Object.entries(nationalStats.partyStats)
        .map(([name, stats]) => {
            const info = getPartyInfo(name);
            return {
                name: info.name_en,
                name_th: info.name_th,
                leader: info.leader,
                slogan: info.slogan,
                slogan_th: info.slogan_th,
                seats: stats.totalSeats,
                seatsConstituency: stats.constituencySeats,
                seatsPartyList: stats.partyListSeats,
                votes: stats.votes.toLocaleString(),
                rawVotes: stats.votes,
                color: info.color,
                logo: info.logo
            };
        })
        .sort((a, b) => b.seats - a.seats)
        .filter(p => p.seats > 0); // Filter out parties with 0 seats

    // Output
    const finalData = {
        national: {
            totalVotes: nationalStats.totalVotes.toLocaleString(),
            turnout: "75.22%", // Hardcoded
            parties: topParties
        },
        provinces: provinces
    };

    // Ensure directory exists
    if (!fs.existsSync('/Users/oui/Wutcharin/src/data')) {
        fs.mkdirSync('/Users/oui/Wutcharin/src/data');
    }

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
    console.log(`Successfully processed election data to ${outputPath} `);

} catch (error) {
    console.error("Error processing data:", error);
}
