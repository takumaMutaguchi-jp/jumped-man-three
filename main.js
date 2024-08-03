init();
async function init() {
  //シーン、カメラ
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
  );

  //レンダラ
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor('lightsteelblue');
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  //床
  const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(500, 500),
	new THREE.MeshStandardMaterial({
	  color: 0xf4f4f4,
	  side: THREE.DoubleSide,
	})
  );
  floor.rotation.x = THREE.MathUtils.degToRad(90);
  floor.position.y = -10;
  scene.add(floor);
  floor.receiveShadow = true;

  //メッシュ
  // const geometry = new THREE.TorusKnotGeometry(5, 1.5, 100, 100);
  const geometry = new THREE.ExtrudeGeometry(drawShape(), options)
  const standard = new THREE.MeshStandardMaterial({
	color: 0x3f7b9d,
	roughness: 0,
  });
  const mesh = new THREE.Mesh(geometry, standard);
  // mesh.position.x += 20;
  mesh.castShadow = true;
  scene.add(mesh);


  //svgメッシュテスト
  function drawShape() {
    var svgString = document.querySelector("#batman-path").getAttribute("d");
    var shape = transformSVGPathExposed(svgString);
    return shape;
  }
  var options = {
    amount: 10,
    bevelThickness: 2,
    bevelSize: 1,
    bevelSegments: 3,
    bevelEnabled: true,
    curveSegments: 12,
    steps: 1
  }
  // var shape = createMesh(new THREE.ExtrudeGeometry(
  //   drawShape(), options));

  // function createMesh(geom) {
  //   geom.applyMatrix(new THREE.Matrix4().makeTranslation(-390, -74, 0));
  //   // assign two materials
  //   var meshMaterial = new THREE.MeshPhongMaterial({color: 0x333333, shininess: 100, metal: true});
  //   var mesh = new THREE.Mesh(geom, meshMaterial);
  //   mesh.scale.x = 0.1;
  //   mesh.scale.y = 0.1;
  //   mesh.rotation.z = Math.PI;
  //   mesh.rotation.x = -1.1;
  //   return mesh;
  // }
  // console.log(shape);
  // scene.add(shape);


  //軸ヘルパー
  const axis = new THREE.AxesHelper(20);
  scene.add(axis);

  //カメラポジション
  camera.position.z = 50;

  //オービットコントロール
  const control = new THREE.OrbitControls(camera, renderer.domElement);

  //ライト
  const plight = new THREE.PointLight(0xffffff, 2, 80, 1);
  plight.position.y = 25;
  const pHelper = new THREE.PointLightHelper(plight, 3, 'blue');
  scene.add(pHelper);
  scene.add(plight);
  plight.castShadow = true;
  plight.shadow.mapSize.width = 1024;
  plight.shadow.mapSize.height = 1024;

  //ライトの回転用 変数宣言
  let rad = 0;
  const RADIUS = 8;

  //再帰関数内でアニメーション定義
  function animate() {
	requestAnimationFrame(animate);
	
	rad += 0.01;
	plight.position.x = RADIUS * Math.cos(rad);
	plight.position.z = RADIUS * Math.sin(rad);

	control.update();

	renderer.render(scene, camera);
  }

  animate();
}