<?php
// api.php - example PHP endpoint for legacy integrations
if($_SERVER['REQUEST_METHOD']==='POST'){
  $body = file_get_contents('php://input');
  $json = json_decode($body, true);
  header('Content-Type: application/json');
  echo json_encode(['received'=>true,'payload'=>$json]);
  exit;
}
echo json_encode(['status'=>'ok']);
?>