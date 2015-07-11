<?php
session_start(session_name('taxiAdmin'));

unset($_SESSION['auth']);
session_destroy();
header("HTTP/1.1 307 Temporary Redirect");
header("Location: index.php");
exit;
