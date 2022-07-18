# Ultra3 engine
#### Engine for non-eucledian geometry games with flexible structure.

## Simple scene example
###### How to create your first scene.
First of all, you have to create `World` and `Engine`. For browsers we can use client-side classes, such as `ClientWorld` and `ClientEngine`:

```javascript
// Registry stores entity and map objects classnames to identify
// each entity/map object class by its classname
const world = new ClientWorld({}, new Registry());
const engine = new ClientEngine(world);
```

Once we've created fundamental variables, we can create our first entity. But before we create our first entity, we need to set up some graphics module to display our graphics and some camera to view our graphics. We will use `OpenGLRenderer` and `BaseCamera` for our purposes:

```javascript
const camera = new BaseCamera();
const renderer = new OpenGLRenderer({camera});

// Setup our engine.
// <renderer>, <canvas width>, <canvas height>
engine.setGraphicsModule(renderer, window.screen.width, window.screen.height);
```

Now we're ready to create our first entity. There are plenty of entity classes in U3, but we need only ViewableEntity.

```javascript
const ent = new ViewableEntity({
    classname: "", // Classname to identify class of our entity

    // Entity view model
    model: new Mesh({
        // rotate a bit
        rotation: new Vector(-20 * Math.PI / 180, 20 * Math.PI / 180, 0),
        vertices: [
            new Vector(-1, -1, 0),
            new Vector(1, -1, 0),
            new Vector(1, 1, 0),
            new Vector(-1, -1, 0),
            new Vector(-1, 1, 0),
            new Vector(1, 1, 0)
        ],
        uvs: [
            new Vector(0.0, 1.0),
            new Vector(1.0, 1.0),
            new Vector(1.0, 0.0),
            new Vector(0.0, 1.0),
            new Vector(0.0, 0.0),
            new Vector(1.0, 0.0)
        ],
        material: null // we will define material later...
    })
}, world);
```

Also we should create some material for our entity. Let's use some simple material, like `TexturedMaterial`, it only provides texture displaying, without any shading such as light shading, etc.

```javascript
// First of all we need to create a texture
const texture = new Texture2D({
    width: 0,
    height: 0,
    colorMode: ColorMode.RGBA,
    framesPerSecond: 1, // for animation purposes,
    magSamplingMode: SamplingMode.TRILINEAR,
    minSamplingMode: SamplingMode.TRILINEAR,
    frames: [], // if you want to define texture buffer manually
    textureFormat: TextureFormat.TEXTUREFORMAT_UNSIGNED_BYTE
}, engine, false);

// Load some image
texture.load("/path/to/image.png");
// Also acceptable:
// const texture = new Texture2D(...).load("<path>")

// Create our material
const texturedMaterial = new TexturedMaterial(engine, texture);

// Now our entity is
const ent = new ViewableEntity({
    ...
    model: new Mesh({
        ...
        material: texturedMaterial
    })
}, world);
```

Once we've created our entity, we can start rendering. All we need is to call `Engine.runRenderLoop`:

```javascript
engine.runRenderLoop();

// Set camera position to view our entity properly
camera.position.z = -2;
```

Great! Now we see rotated plane with some texture.
By default in U3 camera won't move by pressing keyboard keys. You need to do it on your own.