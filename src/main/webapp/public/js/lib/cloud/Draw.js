Ext.define('lib.cloud.Draw', {
    constructor: function (config) {
        this.panel = config.panel;
        this.container = this.panel.el.dom;
        this.autoDraw = config.autoDraw;
        this.callback = config.callback;
        this.scope = config.scope;
        if (this.autoDraw) {
            this.startPaint();
        }
    },
    startPaint: function () {
        if (!this.container) {
            return;
        }
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        var callback = this.callback;
        var scope = this.scope;
        var panel = this.panel;

        var container = this.container;
        var camera, scene, renderer;
        var mesh, geometry, material;

        var mouseX = 0, mouseY = 0;
        var start_time = Date.now();

        var containerHeight = panel.getHeight();
        var containerWidth = panel.getWidth();
        var windowHalfX = containerWidth / 2;
        var windowHalfY = containerHeight / 2;


        function init() {

            var canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = containerHeight;
            canvas.setAttribute("id", 'aaa');

            var context = canvas.getContext('2d');

            var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "#1e4877");
            gradient.addColorStop(0.5, "#4584b4");

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);

            container.style.background = 'url(' + canvas.toDataURL('image/png') + ')';
            container.style.backgroundSize = '32px 100%';
            container.style.position = 'fixed';
            container.style.top = '0px';

            //

            camera = new THREE.PerspectiveCamera(30, containerWidth / containerHeight, 1, 3000);
            camera.position.z = 6000;

            scene = new THREE.Scene();

            geometry = new THREE.Geometry();

            var texture = THREE.ImageUtils.loadTexture('public/img/app/index/cloud.png', null, animate);
            texture.magFilter = THREE.LinearMipMapLinearFilter;
            texture.minFilter = THREE.LinearMipMapLinearFilter;

            var fog = new THREE.Fog(0x4584b4, -100, 3000);

            material = new THREE.ShaderMaterial({

                uniforms: {

                    "map": {type: "t", value: texture},
                    "fogColor": {type: "c", value: fog.color},
                    "fogNear": {type: "f", value: fog.near},
                    "fogFar": {type: "f", value: fog.far},

                },
                vertexShader: document.getElementById('vs').textContent,
                fragmentShader: document.getElementById('fs').textContent,
                depthWrite: false,
                depthTest: false,
                transparent: true

            });

            var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

            for (var i = 0; i < 8000; i++) {

                plane.position.x = Math.random() * 1000 - 500;
                plane.position.y = -Math.random() * Math.random() * 200 - 15;
                plane.position.z = i;
                plane.rotation.z = Math.random() * Math.PI;
                plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

                THREE.GeometryUtils.merge(geometry, plane);

            }

            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = -8000;
            scene.add(mesh);

            renderer = new THREE.WebGLRenderer({antialias: false});
            renderer.setSize(containerWidth, containerHeight);
            container.appendChild(renderer.domElement);
            renderer.domElement.style.position = 'absolute';
            renderer.domElement.style.top = '0px';

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            panel.el.dom.style['z-index'] = renderer.domElement.style['z-index'] * 1 + 100;
            panel.on({
                resize: onPanelResize,
            })

        }

        function onDocumentMouseMove(event) {

            mouseX = ( event.clientX - windowHalfX ) * 0.25;
            mouseY = ( event.clientY - windowHalfY ) * 0.15;

        }

        function onPanelResize(event) {

            var width = panel.getWidth();
            var height = panel.getHeight();
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }

        var timeCounter = 0;
        function animate() {
            timeCounter = timeCounter +1;
            if(timeCounter == 2) {
                if(callback) {
                    callback.apply(scope || this, [])
                }
            }
            requestAnimationFrame(animate);
            var position = ( ( Date.now() - start_time ) * 0.03 ) % 8000;
            camera.position.x += ( mouseX - camera.position.x ) * 0.01;
            camera.position.y += ( -mouseY - camera.position.y ) * 0.01;
            camera.position.z = -position + 8000;
            renderer.render(scene, camera);
        }

        init();

    },

})
;