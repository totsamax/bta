<?php
session_start( session_name('taxiAdmin') );
if($_SESSION['auth'] == TRUE){
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: index.php");
}
$login = htmlentities(strip_tags(trim($_POST['login'])), ENT_QUOTES);
$password = md5($_POST['password']);
$url="http://api.bishkektaxi.org/LKUserAuthentificate?login=$login&password_hash=$password";
 
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
$data = curl_exec($ch);
curl_close($ch);


if(empty($login) || empty($password)){

    echo $_SESSION['message'] = "Заполните все поля";
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: login.php");

} else if ($data!="\"Success\"1"){
    echo $_SESSION['message'] = "Пользователя с таими данными нет в базе";
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: login.php");
} else {
    echo $_SESSION['message'] = "Вы успешно залогинены";
    $_SESSION['auth'] = TRUE;
    $_SESSION['login'] = $login;
    $_SESSION['password'] = $password;
   
    header("HTTP/1.1 302 Moved Temporarily");
    header("Location: index.php");
}
?>
<script language = 'javascript'>
  var delay = 1000;
  setTimeout("document.location.href='http://bishkektaxi.org/taxiAdmin/'", delay);
</script>
<p>Через 1 секунду Вы будете перенаправлены главную страницу системы администрирования. <br>Если этого не происходит, то перейдите самостоятельно: <a href='http://bishkektaxi.org/taxiAdmin/'>Система мониторнига и управления Бишкек Такси</a></p>


