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

        // Créer un cube
        var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene1);

        // Variable pour stocker le modèle de la tortue
        var turtle;

        // Chargement du modèle importé
        BABYLON.SceneLoader.ImportMesh(null, "./model/", "turtle.glb", scene1, function (meshes, particleSystems, skeletons, animationGroups) {
            // Assigner le premier mesh (la tortue) à la variable turtle
            turtle = meshes[0];

            // Désactiver la rotation par quaternion
            turtle.rotationQuaternion = null;

            // Activer la réception et la projection d'ombres
            turtle.receiveShadows = true;
            turtle.castShadow = true;
            
            turtle.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
            // Stocker les animations dans un tableau
            var animations = [];
            animationGroups.forEach(function(animationGroup, index) {
                animations[index] = animationGroup;
            });
        });

        // Fonction de mise à jour avant le rendu
        scene1.registerBeforeRender(function () {
            // Faire tourner le cube
            box.rotation.y += 0.01;

            if (turtle) {
                turtle.rotation.y += 0.01;
            }
           
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
