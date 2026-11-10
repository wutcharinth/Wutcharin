import { toSatang, withCheckDigit as T, type Account, type ClientCtx, type Ctrl, type Doc, type DocType, type Say, type VendorRule } from './engine';

/**
 * The product's own sample client (bancheesolution, src/worker/templates.ts):
 * a building-cleaning company, tax month October 2026 (ต.ค. 2569), 18
 * documents chosen to trip every kind of check. The Thai text is what the
 * engine reads; the English is a reading aid and never reaches the engine.
 */

export const TAX_MONTH = '2026-10';
export const CLIENT = {
    name: { th: 'บจ. สยามคลีนนิ่ง (ตัวอย่าง)', en: 'Siam Cleaning Co. (sample)' } as Say,
    biz: { th: 'บริการทำความสะอาดอาคาร', en: 'Building cleaning services' } as Say,
    tin: '0999999000021',
    software: 'PEAK',
};
export const CTRL: Ctrl = { vat: '1154', ap: '2110', wht: '2132' };

type Acct = [code: string, th: string, en: string, keywords: string];
const CHART: Acct[] = [
    ['1250', 'เครื่องมือและอุปกรณ์', 'Tools and equipment', 'เครื่อง|อุปกรณ์'],
    ['5110', 'ค่าจ้างเหมาช่วง', 'Subcontract labour', 'จ้างเหมา|รับเหมา|แม่บ้าน|ค่าแรง'],
    ['5120', 'วัสดุทำความสะอาด (ต้นทุนบริการ)', 'Cleaning supplies (cost of service)', 'น้ำยา|ทำความสะอาด|ถุงขยะ|ไม้ถู'],
    ['5130', 'วัสดุสิ้นเปลือง', 'Office supplies', 'กระดาษ|หมึก|ปากกา|เครื่องเขียน|แฟ้ม'],
    ['5210', 'ค่าขนส่ง', 'Transport', 'ขนส่ง|ส่งของ|ไปรษณีย์'],
    ['5220', 'ค่าน้ำมันเชื้อเพลิง', 'Fuel', 'น้ำมัน|ดีเซล|แก๊สโซฮอล์|เบนซิน'],
    ['5250', 'ค่าซ่อมแซมยานพาหนะ', 'Vehicle repairs', 'ซ่อมบำรุงรถ|ซ่อมรถ|ยางรถ'],
    ['5310', 'ค่าเช่า', 'Rent', 'เช่า'],
    ['5320', 'ค่าอินเทอร์เน็ตและโทรศัพท์', 'Internet and phone', 'อินเทอร์เน็ต|โทรศัพท์|มือถือ|ไฟเบอร์'],
    ['5325', 'ค่าไฟฟ้าและน้ำประปา', 'Electricity and water', 'ไฟฟ้า|ประปา'],
    ['5330', 'ค่าซอฟต์แวร์และบริการคลาวด์', 'Software and cloud services', 'ซอฟต์แวร์|software|cloud|subscription|license'],
    ['5340', 'ค่ารับรอง', 'Entertainment', 'รับรอง|เลี้ยง|ห้องอาหาร|ภัตตาคาร'],
    ['5350', 'ค่าโฆษณา', 'Advertising', 'โฆษณา|advertising|ป้าย'],
    ['5360', 'ค่าธรรมเนียมวิชาชีพ', 'Professional fees', 'ทนาย|กฎหมาย|ที่ปรึกษา|สอบบัญชี'],
    ['5370', 'ค่าธรรมเนียมธนาคาร', 'Bank fees', 'ธรรมเนียมธนาคาร|ค่าธรรมเนียม'],
    ['5380', 'สวัสดิการพนักงาน', 'Staff welfare', 'น้ำดื่ม|ขนม|สวัสดิการ|เครื่องดื่ม'],
    ['5990', 'ค่าใช้จ่ายเบ็ดเตล็ด', 'Miscellaneous expenses', ''],
];
/** What the engine reads: Thai names and keywords. */
export const ACCOUNTS: Account[] = CHART.map(([code, name, , keywords]) => ({ code, name, keywords }));
export const ACCOUNT_NAME: Record<string, Say> = Object.fromEntries(CHART.map(([code, th, en]) => [code, { th, en }]));

/** What the client's books already show for these vendors. */
const HISTORY: [vendor: string, code: string, times: number][] = [
    ['บจ. ออฟฟิศเมท ซัพพลาย', '5130', 6],
    ['บจ. น้ำยาสะอาดไทย', '5120', 4],
    ['บจ. ทองดีโลจิสติกส์', '5210', 9],
    ['บจ. อินเทอร์เน็ตไทย', '5320', 12],
    ['นางสมศรี มีที่ดิน', '5310', 10],
];
export const initialRules = (): Record<string, VendorRule> => Object.fromEntries(HISTORY.map(([v, code, n]) => [v, { code, n, src: 'hist' as const }]));

export const baseCtx = (vendorRules: Record<string, VendorRule>): ClientCtx => ({
    tin: CLIENT.tin,
    capThreshold: toSatang(10000),
    assetCode: '1250',
    miscCode: '5990',
    vatxCodes: ['5340'],
    accounts: ACCOUNTS,
    vendorRules,
});

type Row = {
    date: string;
    no: string;
    vendor: string;
    vendorEn: string;
    tin: string;
    desc: string;
    descEn: string;
    base: number;
    vat: number;
    wht: number;
    type: DocType;
    /** How the document arrived. */
    src: string;
    buyerTin?: string;
    vatReg?: boolean;
};
const ROWS: Row[] = [
    { date: '2026-10-28', no: 'IV6910-0457', vendor: 'บจ. ออฟฟิศเมท ซัพพลาย', vendorEn: 'OfficeMate Supply Co.', tin: '0999999000012', desc: 'กระดาษ A4 80 แกรม 10 รีม และตลับหมึก', descEn: 'A4 paper, 10 reams, and ink cartridges', base: 2650, vat: 185.5, wht: 0, type: 'full', src: 'LINE' },
    { date: '2026-10-25', no: 'INV-25691025', vendor: 'บจ. น้ำยาสะอาดไทย', vendorEn: 'Thai Clean Solutions Co.', tin: T('099999900013'), desc: 'น้ำยาทำความสะอาดพื้น 4 แกลลอน', descEn: 'Floor cleaner, 4 gallons', base: 1000, vat: 72, wht: 0, type: 'full', src: 'Excel' },
    { date: '2026-10-21', no: 'TL-10-2569-88', vendor: 'บจ. ทองดีโลจิสติกส์', vendorEn: 'Thongdee Logistics Co.', tin: '0999999000047', desc: 'ค่าขนส่งอุปกรณ์ไปหน้างาน', descEn: 'Transport of equipment to site', base: 18500, vat: 1295, wht: 185, type: 'full', src: 'LINE' },
    { date: '2026-10-22', no: 'RC-10-0921', vendor: 'บจ. ห้องอาหารบ้านไทย', vendorEn: 'Baan Thai Restaurant Co.', tin: T('099999900011'), desc: 'เลี้ยงรับรองลูกค้า 6 ท่าน', descEn: 'Client entertainment, 6 guests', base: 4800, vat: 336, wht: 0, type: 'full', src: 'LINE' },
    { date: '2026-10-09', no: 'SV69-10233', vendor: 'บจ. เอเชียมอเตอร์ เซอร์วิส', vendorEn: 'Asia Motor Service Co.', tin: T('099999900012'), desc: 'ซ่อมบำรุงรถยนต์นั่ง ทะเบียน 1กข 1234', descEn: 'Passenger car maintenance, plate 1กข 1234', base: 6200, vat: 434, wht: 0, type: 'full', src: 'Email' },
    { date: '2026-10-28', no: 'IV6910-0457', vendor: 'บจ. ออฟฟิศเมท ซัพพลาย', vendorEn: 'OfficeMate Supply Co.', tin: '0999999000012', desc: 'กระดาษ A4 80 แกรม 10 รีม และตลับหมึก', descEn: 'A4 paper, 10 reams, and ink cartridges', base: 2650, vat: 185.5, wht: 0, type: 'full', src: 'LINE' },
    { date: '2026-10-01', no: 'ET2569100088', vendor: 'บจ. อินเทอร์เน็ตไทย', vendorEn: 'Internet Thai Co.', tin: T('099999900014'), desc: 'อินเทอร์เน็ตองค์กร 1 Gbps ต.ค.', descEn: 'Corporate internet 1 Gbps, October', base: 1890, vat: 132.3, wht: 0, type: 'etax', src: 'Email' },
    { date: '2026-10-16', no: 'MT-2569-0874', vendor: 'บจ. เครื่องมือช่างไทย', vendorEn: 'Thai Tools Co.', tin: T('099999900016'), desc: 'เครื่องขัดพื้นอุตสาหกรรม 1 เครื่อง', descEn: 'Industrial floor polisher, 1 unit', base: 25000, vat: 1750, wht: 0, type: 'full', src: 'Drive' },
    { date: '2026-10-31', no: 'RENT-10', vendor: 'นางสมศรี มีที่ดิน', vendorEn: 'Mrs Somsri (landlord)', tin: '1234567890121', desc: 'ค่าเช่าสำนักงาน ต.ค.', descEn: 'Office rent, October', base: 30000, vat: 0, wht: 1500, type: 'cash', src: 'Drive' },
    { date: '2026-10-31', no: 'INV-SG-5521', vendor: 'Cloud Software Asia Pte. Ltd.', vendorEn: 'Cloud Software Asia Pte. Ltd.', tin: '', desc: 'ค่าใช้ซอฟต์แวร์ (software subscription) ต.ค.', descEn: 'Software subscription, October', base: 20000, vat: 0, wht: 3000, type: 'foreign', src: 'Email' },
    { date: '2026-10-17', no: 'POS 004812', vendor: 'ร้านสะดวกซื้อ สาขาสุขุมวิท 21', vendorEn: 'Convenience store, Sukhumvit 21', tin: T('099999900005'), desc: 'น้ำดื่ม ขนม สำหรับประชุมทีม', descEn: 'Water and snacks for a team meeting', base: 186.92, vat: 13.08, wht: 0, type: 'abb', src: 'LINE' },
    { date: '2026-03-14', no: 'TX-2569/0311', vendor: 'บจ. รุ่งเรืองเครื่องมือช่าง', vendorEn: 'Rungrueang Tools Co.', tin: '0999999000039', desc: 'อะไหล่เครื่องขัดพื้น', descEn: 'Floor polisher spare parts', base: 6500, vat: 455, wht: 0, type: 'full', src: 'LINE', buyerTin: '' },
    { date: '2026-10-12', no: '005/2569', vendor: 'ร้านป้ายสวยงาม', vendorEn: 'Suay-ngam Sign Shop', tin: T('123456789013'), desc: 'ป้ายไวนิลหน้าอาคาร 2 ผืน', descEn: 'Vinyl banners for the building front, 2 pieces', base: 3000, vat: 210, wht: 0, type: 'full', src: 'LINE', vatReg: false },
    { date: '2026-10-05', no: 'CM-6910-031', vendor: 'บจ. ครีเอทีฟมีเดีย', vendorEn: 'Creative Media Co.', tin: T('099999900017'), desc: 'ค่าโฆษณาออนไลน์ แคมเปญ ต.ค.', descEn: 'Online advertising, October campaign', base: 48500, vat: 3395, wht: 970, type: 'full', src: 'Excel' },
    { date: '2026-10-30', no: 'MB-2569-112', vendor: 'บจ. สยามแม่บ้านเซอร์วิส', vendorEn: 'Siam Housekeeping Service Co.', tin: T('099999900018'), desc: 'ค่าจ้างเหมาแม่บ้านประจำหน้างาน', descEn: 'Contract housekeeping staff on site', base: 64000, vat: 4480, wht: 0, type: 'full', src: 'LINE' },
    { date: '2026-10-19', no: 'OS-55120', vendor: 'บจ. ปั๊มน้ำมันไทยรุ่งเรือง', vendorEn: 'Thai Rungrueang Fuel Co.', tin: T('099999900019'), desc: 'น้ำมันดีเซล รถกระบะ 2ฒค 5678', descEn: 'Diesel for pickup truck 2ฒค 5678', base: 1500, vat: 105, wht: 0, type: 'full', src: 'LINE' },
    { date: '2026-10-19', no: 'เล่ม 12/37', vendor: 'ร้าน ช.การช่าง', vendorEn: 'Chor Hardware Shop', tin: '', desc: 'ปูนกาว 2 ถุง แปรงทาสี 4 อัน', descEn: 'Tile adhesive, 2 bags, and 4 paint brushes', base: 640, vat: 0, wht: 0, type: 'cash', src: 'LINE' },
    { date: '2026-10-24', no: 'MEA-69102488', vendor: 'การไฟฟ้านครหลวง', vendorEn: 'Metropolitan Electricity Authority', tin: T('099999900020'), desc: 'ค่าไฟฟ้า ต.ค. สำนักงาน', descEn: 'Electricity for the office, October', base: 9860, vat: 690.2, wht: 0, type: 'full', src: 'Email' },
];

export type DemoDoc = Doc & { seq: number; src: string; vendorEn: string; descEn: string };

export const initialDocs = (): DemoDoc[] =>
    ROWS.map((r, i) => ({
        id: `d${i + 1}`,
        seq: i + 1,
        date: r.date,
        no: r.no,
        vendor: r.vendor,
        vendorEn: r.vendorEn,
        tin: r.tin,
        buyerTin: r.buyerTin === undefined ? CLIENT.tin : r.buyerTin,
        vatReg: r.vatReg !== false,
        desc: r.desc,
        descEn: r.descEn,
        base: toSatang(r.base),
        vat: toSatang(r.vat),
        wht: toSatang(r.wht),
        type: r.type,
        status: 'ready',
        code: null,
        codeEdited: false,
        src: r.src,
    }));

export const TYPE_LABEL: Record<DocType, Say> = {
    full: { th: 'ใบกำกับเต็มรูป', en: 'Full tax invoice' },
    etax: { th: 'e-Tax Invoice', en: 'e-Tax Invoice' },
    abb: { th: 'ใบกำกับอย่างย่อ', en: 'Abbreviated tax invoice' },
    cash: { th: 'บิล / ใบเสร็จ', en: 'Bill or receipt' },
    foreign: { th: 'ต่างประเทศ', en: 'Foreign invoice' },
};
