/* Global Builders and/or THREE.js helpers */
var color = function(r, g, b) {
    if( r !== undefined && g !== undefined && b !== undefined ) {
        return new THREE.Color(r, g, b);
    }

    if( r !== undefined ) {
        return new THREE.Color(r, r, r);
    }
}

var material = function(materialClassName, params) {
    baseMaterialClassName = materialClassName;

    if( THREE[materialClassName] === undefined ) {
        materialClassName += 'Material';
    }

    if( THREE[materialClassName] === undefined ) {
        materialClassName = 'Mesh'+materialClassName;
    }

    if( THREE[materialClassName] === undefined ) {
        console.error("Can't find any Material class called '"+baseMaterialClassName+"'");
        return null;
    } 
    
    return new THREE[materialClassName](params);
}

var mesh = function(geometry, material) {
    return new THREE.Mesh(
        geometry, 
        material
    );
}

var makeScreen = function($container, opts) {
    return new (function($container) {

        this.defaults = {
            nearClipPlane: 0.1,
            farClipPlante: 10000,
            fov: 45,

            onFrame: null
        };

        this.settings = $.extend(this.defaults, opts);

        this.$container    = $( $container );
        this.sceneMeshes   = {};
        this.sceneLights   = {};
        this.sceneTextures = {};

        /* Init */
        this.width  = this.$container.width();
        this.height = this.$container.height();

        this.aspectRatio = this.width / this.height;

        this.renderer = new THREE.WebGLRenderer();
        this.camera   = new THREE.PerspectiveCamera( this.settings.fov, this.aspectRatio, this.settings.nearClipPlane, this.settings.farClipPlante );
        this.scene    = new THREE.Scene();

        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio( window.devicePixelRatio );

        this.scene.add(this.camera);

        this.$container.append( this.renderer.domElement );

        /* Callback/Hooks methods */
        this.onFrame = function(onFrameCallback) {
            this.settings.onFrame = onFrameCallback;
        }

        /* Base methods */
        this.addMesh = function(slug, mesh) {
            this.sceneMeshes[slug] = mesh;
            this.scene.add( this.sceneMeshes[slug] );
        }

        this.getMesh = function(slug) {
            if( this.sceneMeshes[slug] ) {
                return this.sceneMeshes[slug];
            } else {
                console.error("Can't find any object identified by '"+slug+"'");
                return null;
            }
        }

        this.addLight = function(slug, lightObject) {
            this.sceneLights[slug] = lightObject;
            this.scene.add( this.sceneLights[slug] );
        }

        this.getLight = function(slug) {
            if( this.sceneLights[slug] ) {
                return this.sceneLights[slug];
            } else {
                console.error("Can't find any light identified by '"+slug+"'");
                return null;
            }
        }

        this.addTexture = function(slug, texHref) {
            this.sceneTextures[slug] = new THREE.ImageUtils.loadTexture(texHref);

            this.sceneTextures[slug].minFilter = THREE.LinearFilter; 
            this.sceneTextures[slug].magFilter = THREE.LinearFilter; 
        }

        this.getTexture = function(slug) {
            if( this.sceneTextures[slug] ) {
                return this.sceneTextures[slug];
            } else {
                console.error("Can't find any texture identified by '"+slug+"'");
                return null;
            }
        }

        this.getLight = function(slug) {
            if( this.sceneLights[slug] ) {
                return this.sceneLights[slug];
            } else {
                console.error("Can't find any light identified by '"+slug+"'");
                return null;
            }
        }

        this.render = function() {
            var that = this;
            function renderLoop() {
                requestAnimationFrame( renderLoop );

                if( that.settings.onFrame ) {
                    that.settings.onFrame();
                }

                that.renderer.render( that.scene, that.camera );
            }
            renderLoop();
        }

    }) ($container);
}