<?php
/**
 * VKT SUPREME v44.0 - SMART WORKFLOW
 * Cập nhật: Tối ưu UI/UX Admin. Ẩn form License, chỉ hiện ra khi bấm "Xuất bản thuyền con".
 * Triết lý: Logic vật lý > Nhất quán ID > Thao tác gọn gàng.
 */

$folder = "vkt-pro";
$uploadDir = "$folder/uploads";
if (!file_exists($folder)) mkdir($folder, 0755, true);
if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

$dbFile = "$folder/database.json";

// ==========================================
// 1. TẠO LÕI DATABASE TÀU MẸ
// ==========================================
if (!file_exists($dbFile)) {
    $initialData = [
        "profile" => [
            "brand_name" => "VKT SYSTEM", "logo_path" => "", "slogan" => "VKT - VIỆC KHÓ CÓ TOOL LO", 
            "zalo" => "0559793678", "admin_pass" => "vkt2026", "anti_theft" => "on", 
            "pain_title" => "BẠN LÀ NHÀ ĐIỀU HÀNH!", "pain_desc" => "Sở hữu cỗ máy tự động sản xuất hàng ngàn nội dung.", 
            "main_price" => "19.000.000đ", "old_price" => "50.000.000đ", 
            "footer_line1" => "Bản quyền thuộc về CEO Anh Tiến © 2026", "footer_line2" => "Hệ thống tự động hóa AI.", 
            "features" => [["title"=>"Spy Analytics","icon"=>"📺"],["title"=>"Trend Scanner","icon"=>"⚡"],["title"=>"AI Script Master","icon"=>"🧠"],["title"=>"Video Engine","icon"=>"🎥"]]
        ], 
        "gems" => [],
        "licenses" => [
            "VKT-MASTER-2026" => ["status" => "active", "note" => "Khóa gốc của Tàu Mẹ"]
        ]
    ];
    file_put_contents($dbFile, json_encode($initialData, JSON_UNESCAPED_UNICODE));
}

// ==========================================
// 2. TẠO FILE API KIỂM TRA BẢN QUYỀN (Đặt ở thư mục gốc)
// ==========================================
$apiCode = '<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
$dbFile = "vkt-pro/database.json";
if(!file_exists($dbFile)){ echo json_encode(["status"=>"error", "msg"=>"Database Tàu Mẹ lỗi!"]); exit; }
$db = json_decode(file_get_contents($dbFile), true);
$key = $_GET["key"] ?? "";
if(isset($db["licenses"][$key]) && $db["licenses"][$key]["status"] === "active") {
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode(["status"=>"error"]);
}
?>';
file_put_contents("vkt_api.php", $apiCode);

// ==========================================
// 3. TRẠM ADMIN MASTER v44.0 (MENU ẨN THÔNG MINH)
// ==========================================
$adminCode = '<?php
session_start(); $dbFile = "database.json"; $db = json_decode(file_get_contents($dbFile), true);

// BỘ LỌC ĐĂNG NHẬP
if(isset($_POST["login"])){ if($_POST["p"]==$db["profile"]["admin_pass"]) $_SESSION["vkt_auth"]=1; }
if(isset($_GET["out"])){ session_destroy(); header("Location: index.php"); exit; }
if(!isset($_SESSION["vkt_auth"])){ ?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>VKT LOGIN</title><style>body{background:#0a0e17;color:#fff;display:flex;height:100vh;margin:0;font-family:sans-serif;}.l{width:100%;max-width:400px;margin:auto;background:#0d121d;padding:40px;border-radius:20px;text-align:center;box-shadow:0 0 50px rgba(251,176,59,0.1);}input{width:100%;padding:15px;margin:15px 0;background:#1a2233;border:1px solid #333;color:#fff;border-radius:12px;box-sizing:border-box;}button{background:#fbb03b;padding:15px;border:none;border-radius:12px;font-weight:900;cursor:pointer;width:100%;}</style></head><body><div class="l"><h2 style="color:#fbb03b;margin-top:0;">TÀU MẸ VKT SYSTEM</h2><form method="POST"><input type="password" name="p" placeholder="Mật mã lõi..." autofocus><button type="submit" name="login">VÀO PHÒNG ĐIỀU HÀNH</button></form></div></body></html>
<?php exit; } 

// XỬ LÝ BACKUP DỮ LIỆU
if(isset($_POST["do_backup"])){
    header("Content-Type: application/json");
    header("Content-Disposition: attachment; filename=VKT_Backup_".date("Ymd_His").".json");
    echo json_encode($db, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// XỬ LÝ XUẤT FILE CHO KHÁCH (THUYỀN CON)
if(isset($_POST["export_client"])){
    $master_domain = $_SERVER["HTTP_HOST"];
    $client_code = \'<?php
/** VKT CLIENT VERSION - BẢN NHƯỢNG QUYỀN */
$folder = "vkt-client"; $dbFile = "$folder/database.json";
if(!file_exists($folder)) { mkdir($folder, 0755, true); mkdir("$folder/uploads", 0777, true); }
if(!file_exists($dbFile)) {
    $init = ["profile"=>["brand_name"=>"VKT CLONE","slogan"=>"VKT - VIỆC KHÓ CÓ TOOL LO","logo_path"=>"","admin_pass"=>"123456","zalo"=>"0559793678","anti_theft"=>"off","license_key"=>"","pain_title"=>"NỖI ĐAU","pain_desc"=>"Mô tả","main_price"=>"VND","footer_line1"=>"Bản quyền VKT 2026","footer_line2"=>"Phân phối độc quyền","features"=>[["title"=>"F1","icon"=>"📺"],["title"=>"F2","icon"=>"⚡"],["title"=>"F3","icon"=>"🧠"],["title"=>"F4","icon"=>"🎥"]]],"gems"=>[]];
    file_put_contents($dbFile, json_encode($init));
}
$db = json_decode(file_get_contents($dbFile), true);
$current_key = $db["profile"]["license_key"] ?? "";

if(isset($_POST["activate_license"])){ $db["profile"]["license_key"] = $_POST["new_key"]; file_put_contents($dbFile, json_encode($db)); header("Refresh:0"); exit; }
$ch = curl_init("https://\' . $master_domain . \'/VKT/vkt_api.php?key=" . urlencode($current_key));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); curl_setopt($ch, CURLOPT_TIMEOUT, 3);
$response = curl_exec($ch); curl_close($ch);
$api_data = json_decode($response, true);
if(!$api_data || $api_data["status"] !== "success") {
    echo "<!DOCTYPE html><html><body style=\\\'background:#0a0e17;color:#fff;text-align:center;padding:50px;font-family:sans-serif;\\\'><h1 style=\\\'color:red;\\\'>⛔ HỆ THỐNG BỊ KHÓA BẢN QUYỀN</h1><p>Vui lòng liên hệ CEO Anh Tiến (Domain: \' . $master_domain . \') để gia hạn.</p><form method=\\\'POST\\\'><input type=\\\'text\\\' name=\\\'new_key\\\' placeholder=\\\'Nhập License Key mới...\\\' style=\\\'padding:10px;width:300px;\\\'><button type=\\\'submit\\\' name=\\\'activate_license\\\' style=\\\'padding:10px;background:red;color:#fff;border:none;\\\'>KÍCH HOẠT</button></form></body></html>"; exit;
}
echo "<h1 style=\\\'color:#00f3ff;text-align:center;\\\'>HỆ THỐNG VKT CLIENT ĐÃ KÍCH HOẠT THÀNH CÔNG!</h1>";
?>\';
    header("Content-Type: text/plain");
    header("Content-Disposition: attachment; filename=vkt_client_installer.php");
    echo $client_code;
    exit;
}

// XỬ LÝ LƯU LICENSE MỚI
$show_license_panel = false;
if(isset($_POST["add_license"])){
    $new_l = strtoupper(trim($_POST["new_license_key"]));
    if(!empty($new_l)){ $db["licenses"][$new_l] = ["status" => "active", "note" => $_POST["license_note"]]; file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); }
    $show_license_panel = true;
}
if(isset($_GET["toggle_lic"])){
    $k = $_GET["toggle_lic"];
    if(isset($db["licenses"][$k])) { $db["licenses"][$k]["status"] = ($db["licenses"][$k]["status"] == "active") ? "blocked" : "active"; file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); header("Location: admin.php?open_panel=1"); exit; }
}
if(isset($_GET["open_panel"])) { $show_license_panel = true; }

// XỬ LÝ LƯU CÀI ĐẶT THÔNG THƯỜNG
if(isset($_POST["up_security"])){ $db["profile"]["zalo"] = $_POST["zalo"]; $db["profile"]["anti_theft"] = $_POST["anti_theft"]; if(!empty($_POST["new_pass"])) { $db["profile"]["admin_pass"] = $_POST["new_pass"]; } file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); $msg_sec = "✅ Đã lưu!"; }
if(isset($_POST["up_brand"])){ $db["profile"]["brand_name"] = $_POST["b_name"]; $db["profile"]["slogan"] = $_POST["slogan"]; $db["profile"]["main_price"] = $_POST["m_price"]; $db["profile"]["pain_title"] = $_POST["pain_title"]; $db["profile"]["pain_desc"] = $_POST["pain_desc"]; $db["profile"]["footer_line1"] = $_POST["f_line1"]; $db["profile"]["footer_line2"] = $_POST["f_line2"]; if(!empty($_FILES["logo_file"]["name"])){ $ext = pathinfo($_FILES["logo_file"]["name"], PATHINFO_EXTENSION); $target = "uploads/logo_vkt." . $ext; if(move_uploaded_file($_FILES["logo_file"]["tmp_name"], $target)){ $db["profile"]["logo_path"] = $target; } } for($i=0; $i<4; $i++) { $db["profile"]["features"][$i]["title"] = $_POST["f_title"][$i]; } file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); $msg_brand = "✅ Đã lưu!"; }

if(isset($_POST["save_gem"])){ $v_url = trim($_POST["v_url"]); if(strpos($v_url, "vt.tiktok.com") !== false || strpos($v_url, "vm.tiktok.com") !== false){ $ch = curl_init($v_url); curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true); curl_setopt($ch, CURLOPT_NOBODY, true); curl_exec($ch); $real_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL); curl_close($ch); if($real_url) { $v_url = $real_url; } } if(!empty($_POST["edit_id"])){ foreach($db["gems"] as &$g){ if($g["id"] == $_POST["edit_id"]){ $g["name"] = $_POST["name"]; $g["cat"] = $_POST["cat"]; $g["video"] = $v_url; $g["format"] = $_POST["format"]; $g["price"] = $_POST["price"]; $g["desc"] = $_POST["desc"]; } } } else { $db["gems"][] = ["id"=>uniqid(),"name"=>$_POST["name"],"cat"=>$_POST["cat"]?:"Khác","video"=>$v_url,"format"=>$_POST["format"],"price"=>$_POST["price"],"desc"=>$_POST["desc"],"status"=>"on"]; } file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); header("Location: admin.php"); exit; }
if(isset($_GET["del_gem"])){ $db["gems"]=array_filter($db["gems"],function($g){return $g["id"]!=$_GET["del_gem"];}); file_put_contents($dbFile, json_encode($db, JSON_UNESCAPED_UNICODE)); header("Location: admin.php"); exit; }
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>VKT Tàu Mẹ Admin</title><style>body{background:#05070a;color:#fff;font-family:sans-serif;margin:0;padding:15px;}.grid{display:grid;grid-template-columns:1fr;gap:20px;}.card{background:#0d1117;border:1px solid #1a2233;padding:20px;border-radius:15px;margin-bottom:20px;}input,textarea,select{width:100%;padding:10px;margin:8px 0;background:#161b22;border:1px solid #333;color:#fff;border-radius:8px;box-sizing:border-box;}button{background:#fbb03b;color:#000;padding:15px;border:none;border-radius:10px;font-weight:bold;cursor:pointer;width:100%;transition:0.3s;} button:hover{transform:translateY(-2px);box-shadow:0 5px 15px rgba(251,176,59,0.3);} @media(min-width:992px){.grid{grid-template-columns:350px 350px 1fr;}} .row{display:flex;justify-content:space-between;padding:12px;background:#161b22;margin-top:8px;border-radius:8px;font-size:13px;align-items:center;border:1px solid #222;} .btn{padding:5px 10px;border-radius:5px;text-decoration:none;font-weight:bold;font-size:11px;color:#fff;} .btn-on{background:#00cc66;} .btn-off{background:#ff4d4d;}</style></head>
<body>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="color:#fbb03b;margin:0;">🛸 VKT MOTHERSHIP v44.0</h2>
        <div><a href="index.php" target="_blank" style="color:#00f3ff;text-decoration:none;border:1px solid #00f3ff;padding:8px 15px;border-radius:8px;margin-right:10px;">🚀 XEM TRANG CHỦ</a> <a href="admin.php?out=1" style="color:red;text-decoration:none;font-weight:bold;">[THOÁT]</a></div>
    </div>
    
    <div class="grid">
        <div class="col">
            <div class="card" style="border-color:#bc13fe;">
                <h3 style="color:#bc13fe;margin-top:0;text-align:center;">🏭 QUẢN TRỊ HỆ THỐNG</h3>
                
                <form method="POST"><button type="submit" name="do_backup" style="background:#222;color:#fff;border:1px solid #555;margin-bottom:10px;">💾 TẢI FILE BACKUP DATA</button></form>
                <button type="button" onclick="toggleLicensePanel()" style="background:#bc13fe;color:#fff;margin-bottom:10px;">📦 XUẤT BẢN THUYỀN CON</button>
                
                <div id="license_panel" style="display:<?php echo $show_license_panel ? 'block' : 'none'; ?>; padding-top:15px; border-top:1px dashed #444; margin-top:10px;">
                    
                    <p style="font-size:12px;color:#ccc;margin-bottom:5px;"><b>BƯỚC 1:</b> Tải mã nguồn gốc để giao cho khách hàng.</p>
                    <form method="POST"><button type="submit" name="export_client" style="background:#00f3ff;color:#000;margin-bottom:20px;">📥 TẢI MÃ NGUỒN GIAO KHÁCH</button></form>
                    
                    <p style="font-size:12px;color:#ccc;margin-bottom:5px;"><b>BƯỚC 2:</b> Tạo mã Kích hoạt (License Key) cho khách đó.</p>
                    <form method="POST">
                        <input type="text" name="new_license_key" placeholder="Ví dụ: VKT-VIP-NGUYENVANA" required style="border-color:#00f3ff;font-weight:bold;color:#00f3ff;text-transform:uppercase;">
                        <input type="text" name="license_note" placeholder="Tên khách hàng / Số điện thoại...">
                        <button type="submit" name="add_license" style="background:#00f3ff;color:#000;">TẠO LICENSE KEY</button>
                    </form>
                    
                    <div style="max-height:250px;overflow-y:auto;margin-top:15px;">
                        <?php foreach($db["licenses"] as $k => $v): ?>
                        <div class="row">
                            <div><b style="color:var(--amber);"><?php echo $k; ?></b><br><span style="font-size:11px;color:#888;"><?php echo $v["note"]; ?></span></div>
                            <a href="admin.php?toggle_lic=<?php echo $k; ?>" class="btn <?php echo ($v["status"]=="active") ? "btn-on" : "btn-off"; ?>"><?php echo ($v["status"]=="active") ? "ĐANG CHẠY" : "ĐÃ KHÓA"; ?></a>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
            
            <div class="card" style="border-color:#ff4d4d;"><h3 style="color:#ff4d4d;margin-top:0;">🔐 BẢO MẬT TÀU MẸ</h3><form method="POST">
                <select name="anti_theft"><option value="on" <?php if($db["profile"]["anti_theft"]=="on") echo "selected"; ?>>🟢 BẬT KHIÊN CHỐNG TRỘM</option><option value="off" <?php if($db["profile"]["anti_theft"]=="off") echo "selected"; ?>>🔴 TẮT KHIÊN</option></select>
                <input type="text" name="zalo" value="<?php echo $db["profile"]["zalo"]; ?>" placeholder="Zalo Master">
                <input type="text" name="new_pass" placeholder="Đổi Pass Admin Tàu Mẹ...">
                <button type="submit" name="up_security" style="background:#ff4d4d;color:#fff;margin-top:10px;">LƯU BẢO MẬT</button>
            </form></div>
        </div>
        
        <div class="col">
            <div class="card"><h3 style="color:#fbb03b;margin-top:0;">🎨 TRANG TRÍ MẶT TIỀN</h3><form method="POST" enctype="multipart/form-data">
                <input type="text" name="b_name" value="<?php echo $db["profile"]["brand_name"]; ?>"><input type="file" name="logo_file" accept="image/*"><input type="text" name="slogan" value="<?php echo $db["profile"]["slogan"]; ?>"><input type="text" name="m_price" value="<?php echo $db["profile"]["main_price"]; ?>">
                <h4 style="color:red;margin:15px 0 5px 0;">NỖI ĐAU:</h4><input type="text" name="pain_title" value="<?php echo $db["profile"]["pain_title"]; ?>"><textarea name="pain_desc" rows="2"><?php echo $db["profile"]["pain_desc"]; ?></textarea>
                <h4 style="color:#00f3ff;margin:15px 0 5px 0;">4 TÍNH NĂNG:</h4><?php foreach($db["profile"]["features"] as $f): ?><input type="text" name="f_title[]" value="<?php echo $f["title"]; ?>"><?php endforeach; ?>
                <h4 style="color:#bc13fe;margin:15px 0 5px 0;">FOOTER:</h4><input type="text" name="f_line1" value="<?php echo $db["profile"]["footer_line1"]; ?>"><input type="text" name="f_line2" value="<?php echo $db["profile"]["footer_line2"]; ?>">
                <button type="submit" name="up_brand" style="margin-top:15px;">LƯU GIAO DIỆN</button>
            </form></div>
        </div>

        <div class="col">
            <div class="card" style="border-color:#00f3ff;"><h3 id="form_title" style="color:#00f3ff;margin-top:0;">💎 NẠP GEM MỚI</h3><form method="POST" id="gem_form"><input type="hidden" name="edit_id" id="edit_id" value=""><div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><input type="text" name="name" id="g_name" placeholder="Tên..." required><input type="text" name="cat" id="g_cat" placeholder="Nhóm..." required></div><input type="text" name="v_url" id="g_url" placeholder="Link Video..." required><select name="format" id="g_format"><option value="9/16">DỌC (9:16)</option><option value="16/9">NGANG (16:9)</option></select><input type="text" name="price" id="g_price" placeholder="Giá..."><textarea name="desc" id="g_desc" rows="3" placeholder="Mô tả..."></textarea><div style="display:flex; gap:10px;"><button type="submit" name="save_gem" id="btn_save_gem" style="background:#00f3ff;color:#000;">LƯU GEM</button><button type="button" id="btn_cancel" onclick="cancelEdit()" style="background:#444;color:#fff;display:none;width:30%;">HỦY</button></div></form><hr style="border-color:#1a2233; margin:25px 0;"><h3 style="color:#fbb03b;margin-top:0;">📦 DANH SÁCH GEMS</h3><input type="text" id="searchGem" placeholder="🔍 Lọc nhanh..." onkeyup="filterAdminGems()" style="background:#1a2233;border-color:#fbb03b;color:#fbb03b;"><div style="max-height:500px; overflow-y:auto; margin-top:10px;">
                    <?php foreach(array_reverse($db["gems"]) as $g): ?>
                    <div class="row admin-gem-row" data-id="<?php echo $g["id"]; ?>" data-name="<?php echo htmlspecialchars($g["name"], ENT_QUOTES); ?>" data-cat="<?php echo htmlspecialchars($g["cat"], ENT_QUOTES); ?>" data-url="<?php echo htmlspecialchars($g["video"], ENT_QUOTES); ?>" data-format="<?php echo $g["format"]; ?>" data-price="<?php echo htmlspecialchars($g["price"], ENT_QUOTES); ?>" data-desc="<?php echo htmlspecialchars($g["desc"], ENT_QUOTES); ?>"><div><b style="color:#fbb03b;">[<?php echo $g["cat"]; ?>]</b> <?php echo $g["name"]; ?></div><div style="display:flex; gap:5px;"><a href="javascript:void(0)" onclick="editGem(this)" class="btn" style="background:#bc13fe;">Sửa</a><a href="admin.php?del_gem=<?php echo $g["id"]; ?>" onclick="return confirm(\'Xóa?\')" class="btn" style="background:#ff4d4d;">Xóa</a></div></div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    <script>
        // JS Đóng mở Xưởng Nhượng Quyền
        function toggleLicensePanel() {
            var panel = document.getElementById("license_panel");
            panel.style.display = (panel.style.display === "none") ? "block" : "none";
        }
        function editGem(btn) { let r = btn.closest(".admin-gem-row"); document.getElementById("edit_id").value = r.dataset.id; document.getElementById("g_name").value = r.dataset.name; document.getElementById("g_cat").value = r.dataset.cat; document.getElementById("g_url").value = r.dataset.url; document.getElementById("g_format").value = r.dataset.format; document.getElementById("g_price").value = r.dataset.price; document.getElementById("g_desc").value = r.dataset.desc; document.getElementById("btn_save_gem").innerText = "✏️ CẬP NHẬT"; document.getElementById("btn_cancel").style.display = "block"; }
        function cancelEdit() { document.getElementById("gem_form").reset(); document.getElementById("edit_id").value = ""; document.getElementById("btn_save_gem").innerText = "LƯU GEM"; document.getElementById("btn_cancel").style.display = "none"; }
        function filterAdminGems() { let i = document.getElementById("searchGem").value.toLowerCase(); let r = document.querySelectorAll(".admin-gem-row"); r.forEach(row => { row.style.display = row.innerText.toLowerCase().includes(i) ? "flex" : "none"; }); }
    </script>
</body></html>';
file_put_contents("$folder/admin.php", $adminCode);

// ==========================================
// 4. MẶT TIỀN INDEX.PHP (KẾ THỪA V41 TỐI THƯỢNG)
// ==========================================
$indexCode = '<?php session_start(); $db = json_decode(file_get_contents("database.json"), true); $p = $db["profile"]; $gems = $db["gems"]; $cats = array_unique(array_column($gems, "cat")); $logo_v = $p["logo_path"] . "?v=" . time(); $f1 = $p["footer_line1"]; $f2 = $p["footer_line2"]; $anti_theft = $p["anti_theft"] ?? "on"; function v_render($u, $f){ $ratio = ($f == "9/16") ? "aspect-ratio: 9/16; width: 100%; max-width: 380px;" : "aspect-ratio: 16/9; width: 100%;"; $jail = \'sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"\'; if(strpos($u, "facebook.com")!==false) { $src = "https://www.facebook.com/plugins/video.php?href=".urlencode($u)."&show_text=0&width=auto"; return "<div class=\"v-container\" style=\"$ratio\"><iframe src=\"$src\" $jail frameborder=\"0\" allow=\"autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share\" allowfullscreen></iframe></div>"; } else if(strpos($u, "tiktok.com")!==false) { preg_match("/video\/(\d+)/", $u, $m); $src = "https://www.tiktok.com/embed/v2/".($m[1]??""); return "<div class=\"v-container\" style=\"$ratio\"><iframe src=\"$src\" $jail frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen></iframe></div>"; } else if(preg_match("/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/", $u, $m)) { $src = "https://www.youtube.com/embed/".$m[1]."?playsinline=1&rel=0&modestbranding=1"; return "<div class=\"v-container\" style=\"$ratio\"><iframe src=\"$src\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen\" allowfullscreen></iframe></div>"; } else { return "<div class=\"v-container\" style=\"$ratio\"><iframe src=\"$u\" frameborder=\"0\" allowfullscreen></iframe></div>"; } } ?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title><?php echo $p["brand_name"]; ?></title><link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet"><style>:root{--amber:#fbb03b;--navy:#0a0e17;--card:#141921;} body{background:var(--navy);color:#fff;font-family:"Inter",sans-serif;margin:0;scroll-behavior:smooth;overflow-x:hidden; <?php if($anti_theft=="on") echo "-webkit-user-select:none;-ms-user-select:none;user-select:none;"; ?>} .header-nav{position:sticky;top:0;background:rgba(10,14,23,0.95);backdrop-filter:blur(10px);z-index:999;border-bottom:1px solid #1a2233;padding:15px 20px;display:flex;justify-content:space-between;align-items:center;} .header-nav .logo-text{font-family:Orbitron;font-size:18px;color:var(--amber);text-decoration:none;display:flex;align-items:center;gap:10px;font-weight:bold;} .header-nav img{height:35px;border-radius:5px;} .desktop-menu{display:none;gap:20px;} .desktop-menu a{color:#fff;text-decoration:none;font-size:14px;font-weight:bold;transition:0.3s;} .desktop-menu a:hover{color:var(--amber);} .menu-toggle{display:block;font-size:24px;cursor:pointer;color:var(--amber);} .left-sidebar{position:fixed;top:0;left:-300px;width:250px;height:100vh;background:#0d1117;z-index:1000;transition:0.3s;padding:20px;border-right:1px solid #1a2233;box-shadow:10px 0 30px rgba(0,0,0,0.5);display:flex;flex-direction:column;} .left-sidebar.active{left:0;} .close-btn{text-align:right;font-size:24px;cursor:pointer;color:#fff;margin-bottom:20px;} .left-sidebar a{display:block;color:#fff;text-decoration:none;padding:15px 0;border-bottom:1px solid #222;font-weight:bold;} .overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:998;display:none;} .overlay.active{display:block;} .hero{background:radial-gradient(circle at center,#162233,#0a0e17);padding:50px 20px;text-align:center;} .logo-main{width:90px;height:90px;border-radius:20px;border:2px solid var(--amber);object-fit:cover;margin-bottom:20px;box-shadow:0 0 20px rgba(251,176,59,0.3);} .container{max-width:1200px;margin:0 auto;padding:0 20px;} .feat-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:15px;margin:40px 0;} .feat-box{background:var(--card);padding:25px 15px;border-radius:20px;border:1px solid #222;text-align:center;font-size:13px;} .pain-box{background:rgba(255,0,0,0.05);border:1px solid rgba(255,0,0,0.2);padding:30px;border-radius:20px;margin-bottom:50px;text-align:center;} .price-card{background:var(--card);border:1px solid var(--amber);border-radius:25px;padding:40px;display:flex;flex-direction:column;align-items:center;gap:20px;margin-bottom:60px;box-shadow:0 10px 30px rgba(0,0,0,0.3);} .filter-bar{display:flex;justify-content:flex-start;gap:10px;margin:40px 0;overflow-x:auto;padding:10px 20px;-webkit-overflow-scrolling:touch;scrollbar-width:none;} .filter-bar::-webkit-scrollbar{display:none;} .filter-btn{flex-shrink:0;background:#1a2233;color:#fff;border:1px solid #333;padding:12px 25px;border-radius:30px;cursor:pointer;white-space:nowrap;transition:0.3s;font-weight:bold;} .filter-btn.active,.filter-btn:hover{background:var(--amber);color:#000;border-color:var(--amber);} .gem-item{display:flex;flex-direction:column;gap:30px;margin-bottom:60px;background:#0d1117;padding:25px;border-radius:30px;border:1px solid #1a2233;align-items:center;} .v-container{background:#000;border-radius:20px;overflow:hidden;border:1px solid #333;} .v-container iframe{width:100%;height:100%;} .btn-buy{display:block;background:var(--amber);color:#000;text-align:center;padding:20px;border-radius:15px;font-weight:900;text-decoration:none;width:100%;box-sizing:border-box;text-transform:uppercase;transition:0.3s;} .btn-buy:hover{transform:translateY(-3px);box-shadow:0 10px 20px rgba(251,176,59,0.3);} .main-footer{background:#080a0f;border-top:1px solid #1a2233;padding:40px 20px;text-align:center;margin-top:50px;} .main-footer p{color:#888;font-size:13px;line-height:1.8;margin:5px 0;} .main-footer h3{color:var(--amber);font-family:Orbitron;margin-bottom:15px;} @media(min-width:992px){.menu-toggle{display:none;} .desktop-menu{display:flex;} .feat-grid{grid-template-columns:repeat(4,1fr);} .price-card{flex-direction:row;justify-content:space-between;} .gem-item{flex-direction:row;padding:40px;} .filter-bar{justify-content:center;}}</style></head>
<body>
    <header class="header-nav"><a href="#" class="logo-text"><?php if($p["logo_path"]): ?><img src="<?php echo $logo_v; ?>"><?php endif; ?><?php echo $p["brand_name"]; ?></a><nav class="desktop-menu"><a href="#features">TÍNH NĂNG</a><a href="#price">BẢNG GIÁ</a><a href="#galaxy">KHO GEMS</a></nav><div class="menu-toggle" onclick="toggleSidebar()">☰</div></header>
    <div class="overlay" id="overlay" onclick="toggleSidebar()"></div>
    <div class="left-sidebar" id="sidebar"><div class="close-btn" onclick="toggleSidebar()">✕</div><a href="#features" onclick="toggleSidebar()">📺 Tính Năng</a><a href="#price" onclick="toggleSidebar()">💎 Bảng Giá</a><a href="#galaxy" onclick="toggleSidebar()">🌌 Kho Trợ Lý</a><a href="https://zalo.me/<?php echo $p["zalo"]; ?>" onclick="toggleSidebar()" style="color:var(--amber);">📞 Liên Hệ Zalo</a><div style="flex-grow:1;"></div></div>
    <div class="hero">
        <?php if($p["logo_path"]): ?><img src="<?php echo $logo_v; ?>" class="logo-main"><?php endif; ?>
        <h1 style="font-family:Orbitron;font-size:42px;margin:0;"><?php echo $p["brand_name"]; ?></h1><p style="color:var(--amber);letter-spacing:5px;font-weight:900;"><?php echo $p["slogan"]; ?></p>
        <div class="container">
            <div id="features" style="padding-top:20px;"></div><div class="feat-grid"><?php foreach($p["features"] as $f): ?><div class="feat-box"><span style="font-size:24px;"><?php echo $f["icon"]; ?></span><br><br><b><?php echo $f["title"]; ?></b></div><?php endforeach; ?></div>
            <div class="pain-box"><h2 style="color:red;margin:0;font-family:Orbitron;"><?php echo $p["pain_title"]; ?></h2><p style="color:#aaa;margin-top:15px;line-height:1.6;"><?php echo $p["pain_desc"]; ?></p></div>
            <div id="price" style="padding-top:20px;"></div><div class="price-card"><div style="text-align:left;"><h3 style="color:var(--amber);margin:0 0 10px 0;font-family:Orbitron;">BẢN QUYỀN VIP</h3><h2 style="font-size:50px;margin:0;"><?php echo $p["main_price"]; ?></h2></div><a href="https://zalo.me/<?php echo $p["zalo"]; ?>" class="btn-buy" style="max-width:300px;">LIÊN HỆ SỞ HỮU</a></div>
            <div id="galaxy" style="padding-top:20px;"></div><h2 style="font-family:Orbitron;color:var(--amber);margin:60px 0 20px 0;">DANH SÁCH TRỢ LÝ (GEMS)</h2><div class="filter-bar"><button class="filter-btn active" onclick="filterGems(\'all\')">TẤT CẢ GALAXY</button><?php foreach($cats as $c): ?><button class="filter-btn" onclick="filterGems(\'<?php echo $c; ?>\')"><?php echo strtoupper($c); ?></button><?php endforeach; ?></div>
            <div id="gem-list">
                <?php foreach(array_reverse($gems) as $g): ?>
                <div class="gem-item" data-cat="<?php echo $g["cat"]; ?>"><?php echo v_render($g["video"], $g["format"]); ?><div style="text-align:left;flex:1;width:100%;"><h2 style="color:var(--amber);font-size:32px;margin:0;"><?php echo $g["name"]; ?></h2><span style="display:inline-block;background:rgba(251,176,59,0.1);color:var(--amber);padding:5px 15px;border-radius:8px;font-size:11px;margin-top:10px;font-weight:bold;">NGÁCH: <?php echo strtoupper($g["cat"]); ?></span><div style="background:rgba(255,255,255,0.02);padding:20px;border-radius:15px;margin:20px 0;color:#ccc;line-height:1.8;border:1px solid #222;"><?php echo nl2br($g["desc"]); ?></div><span style="font-size:36px;font-weight:900;display:block;margin-bottom:20px;"><?php echo number_format((int)str_replace([".",","], "", $g["price"])); ?>đ</span><a href="https://zalo.me/<?php echo $p["zalo"]; ?>" class="btn-buy">SỞ HỮU NGAY</a></div></div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
    <footer class="main-footer"><h3><?php echo $p["brand_name"]; ?></h3><p><?php echo $f1; ?></p><p><?php echo $f2; ?></p></footer>
    <script>function toggleSidebar(){document.getElementById("sidebar").classList.toggle("active");document.getElementById("overlay").classList.toggle("active");} function filterGems(cat){const items=document.querySelectorAll(".gem-item");const btns=document.querySelectorAll(".filter-btn");btns.forEach(b=>b.classList.remove("active"));event.target.classList.add("active");items.forEach(item=>{item.style.display=(cat==="all"||item.getAttribute("data-cat")===cat)?"flex":"none";});} <?php if($anti_theft=="on"): ?> document.addEventListener("contextmenu",function(e){e.preventDefault();},false);document.onkeydown=function(e){if(e.keyCode==123){return false;}if(e.ctrlKey&&e.shiftKey&&e.keyCode==73){return false;}if(e.ctrlKey&&e.shiftKey&&e.keyCode==74){return false;}if(e.ctrlKey&&e.shiftKey&&e.keyCode==67){return false;}if(e.ctrlKey&&e.keyCode==85){return false;}if(e.ctrlKey&&e.keyCode==83){return false;}}; <?php endif; ?></script>
</body></html>';
file_put_contents("$folder/index.php", $indexCode);

echo "<div style='background:#0a0e17; color:#bc13fe; padding:40px; border:2px solid #bc13fe; font-family:monospace; text-align:center;'>";
echo "<h1 style='font-size:36px; margin-bottom:10px;'>⚙️ QUY TRÌNH QUẢN TRỊ v44.0 ĐÃ TỐI ƯU</h1>";
echo "<p style='color:#fff; font-size:16px;'>2 Nút chính đã được thiết lập. Form tạo License sẽ ẩn đi cho đến khi bạn sẵn sàng xuất bản Thuyền Con.</p>";
echo "</div>";