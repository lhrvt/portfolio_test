window.addEventListener('DOMContentLoaded', function () {
    // Récupérer le canvas et créer le moteur pour la première scène
    var canvas1 = document.getElementById('renderCanvas1');
    var engine1 = new BABYLON.Engine(canvas1, true, { preserveDrawingBuffer: true, stencil: true });
    
    // Fonction pour créer la première scène
    var createScene1 = function () {
        // Créer la scène
        var scene1 = new BABYLON.Scene(engine1);
        
        // Rendre la scène transparente
        scene1.clearColor = new BABYLON.Color4(0, 0, 0, 0);

        // Créer la caméra
        var camera1 = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2, Math.PI / 2, 4, BABYLON.Vector3.Zero(), scene1);
        camera1.attachControl(canvas1, true);

        // Créer la lumière
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene1);

        // Créer un cub

        // Variable pour stocker le modèle de la tortue
        var turtle;
        BABYLON.Effect.ShadersStore['customVertexShader'] = `
                precision highp float;

                attribute vec3 position;
                attribute vec3 normal;

                uniform mat4 worldViewProjection;

                varying vec3 vNormal;

                void main(void) {
                    // Pass the normal to the fragment shader
                    vNormal = normal;

                    // Calculate the position of the vertex
                    gl_Position = worldViewProjection * vec4(position, 1.0);
                }
            `;
            BABYLON.Effect.ShadersStore['customwhiteFragmentShader'] = `
            precision highp float;
        
            // Varyings
            varying vec3 vNormal;
            uniform float time;
        
            void main(void) {
        
                vec3 normal = normalize(vNormal);
                vec3 lightDir = vec3(0.5* time, 0.5 , 1.0);
                float intensity = dot(normal, lightDir);
        
                if (intensity > 0.6) {
                    gl_FragColor = vec4(0.2, 0.6, 0.8, 1.0);  // Rose pastel
                } else if (intensity > 0.4) {
                    gl_FragColor = vec4(0.4, 0.6, 1.0, 1.0);  // Violet pastel
        
                } else {
                    gl_FragColor = vec4(0.0, 0.0, 0.4, 1.0);  
                }
            }
            `;
         
            var normalTexture = new BABYLON.Texture("as_n.exr", scene1);
            
            var white_toon = new BABYLON.ShaderMaterial('toonShader', scene1, {
                vertex: 'custom',
                fragment: 'customwhite',
            }, {
                needAlphaBlending: false,
                needAlphaTesting: false,
                attributes: ['position', 'normal', 'uv'],
                uniforms: ['worldViewProjection', 'time', 'normalMap'],
        
            });

            
            white_toon.setTexture("normalMap", normalTexture);
        function checkMat(mesh, mat){

            if (mesh.subMeshes) {
                for (var i = 0; i < mesh.subMeshes.length; i++) { 
                    var subMesh = mesh.subMeshes[i];
                    var material = subMesh.getMaterial();
                    console.log(material.name)
                    if (material) {
                        mesh.material = mat
                    }
                }
            } else {
                console.log("Le mesh n'a pas de sous-meshes avec des matériaux différents.");
            }
        }
        
        // Chargement du modèle importé
        BABYLON.SceneLoader.ImportMesh(null, "./model/", "turtle.glb", scene1, function (meshes, particleSystems, skeletons, animationGroups) {
            // Assigner le premier mesh (la tortue) à la variable turtle
            if (meshes.length > 0) {
                turtle = meshes[0];
                turtle.rotationQuaternion = null;
                turtle.receiveShadows = true;
                turtle.castShadow = true;
                turtle.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);

                // Remplacer le matériau à l'index 0 par le shader toon
                
                

                var animations = [];
                animationGroups.forEach(function(animationGroup, index) {
                    animations[index] = animationGroup;
                });
            } else {
                console.error("Aucun mesh n'a été trouvé dans le modèle.");
            }
            scene1.registerBeforeRender(function () {
                if (turtle) {
                    turtle.rotation.y += 0.01;
                }
            });
           
        });

        return scene1;
    };
    
    // Créer la première scène
    var scene1 = createScene1();

    // Boucle de rendu pour la première scène
    engine1.runRenderLoop(function () {
        scene1.render();
        
    });

    // Redimensionner le moteur lorsque la fenêtre est redimensionnée
    window.addEventListener('resize', function () {
        engine1.resize();
    });
});
