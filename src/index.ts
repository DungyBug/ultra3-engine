// ********************************
// *             CORE             *
// ********************************

// common objects

import { World } from "./core/world";
import { Registry } from "./core/registry";
import Engine from "./core/engine";

// helper functions

import { damageEntitiesInRadius } from "./core/damage";

// mapobjects

import { MapObject } from "./core/map-object";
import { Door } from "./core/map/objects/door";
import { Platform } from "./core/map/objects/platform";
import { PlayerSpawn } from "./core/map/objects/playerspawn";
import Portal from "./core/map/objects/portal";
import { BaseTrain } from "./core/map/objects/train";
import { TrainEnd } from "./core/map/objects/train-end";
import { TrainNode } from "./core/map/objects/train-node";
import { TrainStart } from "./core/map/objects/train-start";
import { Trigger } from "./core/map/objects/trigger";

// entities

import { Entity } from "./core/entity";
import { MovableEntity } from "./core/entities/base/movable";
import { PhysicalEntity } from "./core/entities/base/physical";
import { ExplosiveEntity } from "./core/entities/explosive";
import { GunEntity } from "./core/entities/gun";
import { HealthyEntity } from "./core/entities/healthy";
import { PickableEntity } from "./core/entities/pickable";
import { Player } from "./core/entities/player";
import { Weapon } from "./core/entities/weapon";

// constants

import { Side } from "./core/constants/side";
import { TeleportType } from "./core/constants/teleport-type";
import { WeaponState } from "./core/constants/weapon-state";
import { PlatformDirection } from "./core/constants/platform-direction";
import PhysicalModelType from "./core/constants/physical-model-type";
import { PhysicalActivity } from "./core/constants/physical-activity";
import { PlatformState } from "./core/constants/platform-state/platform-state";
import { DoorState } from "./core/constants/door-state/door-state";

// lib

import Matrix2 from "./core/lib/matrix2";
import Matrix3 from "./core/lib/matrix3";
import Vector from "./core/lib/vector";
import Vector2 from "./core/lib/vector2";

// services

import { EventEmitter } from "./core/services/event-emitter";
import Transport from "./core/services/transport";

// contracts

import { IWorld } from "./core/contracts/world";
import { IWorldProps } from "./core/contracts/world-porps";
import WorldModuleEvents from "./core/contracts/world-module-events";
import WorldEvents from "./core/contracts/world-events";
import { PreparedNetData } from "./core/contracts/prepared-net-data";
import IPhysicalMesh from "./core/contracts/physical-mesh";
import BaseModule from "./core/contracts/module";
import IBaseModuleContext from "./core/contracts/module-context";
import { IMapObject } from "./core/contracts/map-object"
import { IMapEvent } from "./core/contracts/map-event";
import IBasePhysicalModel from "./core/contracts/base-physical-model";
import ITransportQueue from "./core/contracts/services/transporter/transport-queue";
import AbstractTransporter from "./core/contracts/services/transporter/abstract-transporter";
import { IForce } from "./core/contracts/physics/force";
import IPhysicsModule from "./core/contracts/modules/physics-module";
import IWorldPhysics from "./core/contracts/modules/physics-parameters";
import { IDoor, IDoorProps, IDoorState } from "./core/contracts/map-objects/door";
import { IPlatform, IPlatformState, IPlatformProps } from "./core/contracts/map-objects/platform";
import { IPlayerSpawn, IPlayerSpawnState, IPlayerSpawnProps } from "./core/contracts/map-objects/playerspawn";
import { IPortal, IPortalState } from "./core/contracts/map-objects/portal";
import { IBaseTrain, IBaseTrainProps } from "./core/contracts/map-objects/train";
import { ITrainEnd, ITrainEndState } from "./core/contracts/map-objects/train-end";
import { ITrainNode, ITrainNodeState } from "./core/contracts/map-objects/train-node";
import { ITrainStart, ITrainStartState } from "./core/contracts/map-objects/train-start";
import { ITrigger } from "./core/contracts/map-objects/trigger";
import { ICameoutMapEvent } from "./core/contracts/map-events/cameout";
import { ICollisionMapEvent } from "./core/contracts/map-events/collision";
import { ICollisionStartMapEvent } from "./core/contracts/map-events/collisionstart";
import { ICollisionStopMapEvent } from "./core/contracts/map-events/collisionstop";
import { IDamageEvent } from "./core/contracts/map-events/damage";
import { IPlayerRespawnEvent } from "./core/contracts/map-events/playerrespawn";
import { IPlayerSpawnEvent } from "./core/contracts/map-events/playerspawn";
import { IPlayerTeleportEvent } from "./core/contracts/map-events/playerteleport";
import { IShootEvent } from "./core/contracts/map-events/shoot";
import { ITriggerEvent } from "./core/contracts/map-events/trigger";
import { IEntity, EntityFromStateFabric, IEntityParams, IEntityState } from "./core/contracts/entity";
import { IMovableEntity, IMovableEntityState } from "./core/contracts/entities/base/movable";
import { IPhysicalEntity, IPhysicalEntityParams, IPhysicalEntityState } from "./core/contracts/entities/base/physical";
import { IExplosiveEntity, IExplosiveEntityParams, IExplosiveEntityState } from "./core/contracts/entities/explosive";
import { IGunEntity, IGunEntityParams } from "./core/contracts/entities/gun";
import { IHealthyEntity, IHealthyEntityParams, IHealthyEntityState } from "./core/contracts/entities/healthy";
import { IPickableEntity, IPickableEntityState } from "./core/contracts/entities/pickable";
import { IPlayer, IPlayerParams, IPlayerState } from "./core/contracts/entities/player";
import { IWeapon, IWeaponParams, IWeaponState } from "./core/contracts/entities/weapon";
import { IKey } from "./core/contracts/base/key";
import { IVector } from "./core/contracts/base/vector";
import IVector2 from "./core/contracts/base/vector2d";


// ********************************
// *            CLIENT            *
// ********************************

// common objects

import Scene from "./client/scene";
import PostEffect from "./client/post-effect";
import PostEffectSystem from "./client/post-effect-system";
import ClientWorld from "./client/client-world";
import ClientEngine from "./client/client-engine";
import BaseMaterial from "./client/base-material";

// textures

import Texture2D from "./client/texture/texture2d";
import Texture3D from "./client/texture/texture3d";
import TextureCubemap from "./client/texture/texture-cubemap";
import RenderTexture from "./client/texture/render-texture";
import RenderTextureCubemap from "./client/texture/cubemap-render-texture";

// services

import HTTPTransporter from "./client/services/transporter/http-transporter";
import ClientWSTransporter from "./client/services/transporter/ws-transporter";

// renderers

import OpenGLRenderer from "./client/renderers/opengl-renderer/opengl-renderer";

// meshes

import BaseMesh from "./client/mesh/base-mesh";
import Mesh from "./client/mesh/mesh";

// materials

import ColoredMaterial from "./client/materials/colored-material";
import DiffuseMaterial from "./client/materials/diffuse-material";
import FreeTexturedMaterial from "./client/materials/free-textured-material";
import PBRMaterial from "./client/materials/pbr-material";
import PhongMaterial from "./client/materials/phong-material";
import ReflectiveMaterial from "./client/materials/reflective-material";
import TexturedMaterial from "./client/materials/textured-material";

// mapobjects

import ClientMapObject from "./client/map/client-object";
import ClientPortal from "./client/map/client-portal";

// lib
// -- loaders

import GLTFLoader from "./client/lib/mesh-loader/gltf-loader/gltf-loader";

// entities

import ClientMovableEntity from "./client/entities/base/movable";
import ClientPhysicalEntity from "./client/entities/base/physical";
import ViewableEntity from "./client/entities/base/viewable";
import EffectEntity from "./client/entities/effect";
import ClientExplosiveEntity from "./client/entities/explosive";
import ClientGunEntity from "./client/entities/gun";
import ClientHealthyEntity from "./client/entities/healthy";
import LightEntity from "./client/entities/light";
import ClientPickableEntity from "./client/entities/pickable";
import ClientPlayer from "./client/entities/player";
import ClientWeapon from "./client/entities/weapon";

// cameras

import BaseCamera from "./client/cameras/base-camera";
import OrthogonalCamera from "./client/cameras/orthogonal-camera";
import PerspectiveCamera from "./client/cameras/perspective-camera";
import ThirdPersonViewCamera from "./client/cameras/third-person-camera";

// constants

import ColorMode from "./client/constants/color-mode";
import CullMode from "./client/constants/cull-mode";
import DrawMode from "./client/constants/draw-mode";
import ReflectionType from "./client/constants/reflection-type";
import SamplingMode from "./client/constants/sampling-mode";
import TextureFormat from "./client/constants/texture-format";
import VerticesMode from "./client/constants/verticies-mode";
import { ViewType } from "./client/constants/view-type";

// contracts

import TextureStorage, { Texture2DStorage, Texture3DStorage, TextureCubemapStorage } from "./client/contracts/texture-storage";
import ISprite from "./client/contracts/sprite";
import { IShader } from "./client/contracts/shader";
import IScene from "./client/contracts/scene";
import ISceneOpts from "./client/contracts/scene-opts";
import IPostEffectOpts from "./client/contracts/post-effect-opts";
import PostEffectEvents from "./client/contracts/post-effect-events";
import IMesh from "./client/contracts/mesh";
import IMaterial from "./client/contracts/material";
import ClientWorldEvents from "./client/contracts/client-world-events";
import IBaseMesh from "./client/contracts/base-mesh";
import ITexture2D from "./client/contracts/texture/texture2d";
import ITexture3D from "./client/contracts/texture/texture3d";
import Texture2DOptions from "./client/contracts/texture/texture2d-opts";
import Texture3DOptions from "./client/contracts/texture/texture3d-opts";
import ITexture from "./client/contracts/texture/texture";
import TextureOptions from "./client/contracts/texture/texture-opts";
import IRenderTextureOpts from "./client/contracts/texture/render-texture-opts";
import ICubemapRenderTextureOpts from "./client/contracts/texture/cubemap-render-texture-opts";
import BaseGraphicsModule, { BaseGraphicsModuleEvents } from "./client/contracts/modules/graphics-module";
import IGraphicsParameters from "./client/contracts/modules/graphics-parameters";
import ClientGraphicsModuleEvents from "./client/contracts/modules/client-graphics-module-events";
import IRegisteredMesh from "./client/contracts/mesh/registered-mesh";
import IMeshOptions from "./client/contracts/mesh/mesh-options";
import IBaseMeshOptions from "./client/contracts/mesh/base-mesh-opts";
import BaseMeshEvents from "./client/contracts/mesh/base-mesh-events";
import IBaseMaterialProps from "./client/contracts/materials/base-material-props";
import IColoredMaterialProps from "./client/contracts/materials/colored-material-opts";
import IPBRMaterialProps from "./client/contracts/materials/pbr-material";
import IPhongMaterialProps from "./client/contracts/materials/phong-material-props";
import IReflectiveMaterialProps from "./client/contracts/materials/reflective-material-props";
import ReflectableMaterialProps from "./client/contracts/materials/reflectable-props";
import ISpecularMaterialProps from "./client/contracts/materials/specular-props";
import ITexturedMaterialProps from "./client/contracts/materials/textured-material-props";
import IClientPortalProps from "./client/contracts/map/client-portal-props";
import { IClientMovableEntity } from "./client/contracts/entities/base/movable";
import { IClientPhysicalEntity, IClientPhysicalEntityParams } from "./client/contracts/entities/base/physical";
import { IViewableEntity, IViewableEntityParams } from "./client/contracts/entities/base/viewable";
import { IEffectEntity } from "./client/contracts/entities/effect";
import { IClientExplosiveEntity, IClientExplosiveEntityParams } from "./client/contracts/entities/explosive";
import IClientGunEntity, { IClientGunEntityParams } from "./client/contracts/entities/gun";
import IClientHealthyEntity, { IClientHealthyEntityParams } from "./client/contracts/entities/healthy";
import ILight, { IBaseLightParams } from "./client/contracts/entities/light";
import { IClientPickableEntity } from "./client/contracts/entities/pickable";
import IClientPlayer, { IClientPlayerParams } from "./client/contracts/entities/player";
import { IClientWeapon, IClientWeaponParams } from "./client/contracts/entities/weapon";
import TypedArray, { GetArrayConstructor } from "./client/contracts/common/typed-array";
import { IBaseCamera, IPerspectiveCamera, IOrthogonalCamera, Camera } from "./client/contracts/cameras/camera";
import IThirdPersonViewCamera from "./client/contracts/cameras/third-person-camera";


// ********************************
// *            SERVER            *
// ********************************

import ServerWSTransporter from "./client/services/transporter/ws-transporter";
import ServerEvents from "./server/contracts/server-events";

export {
    World,
    Registry,
    Engine,
    damageEntitiesInRadius,
    MapObject,
    Door,
    Platform,
    PlayerSpawn,
    Portal,
    BaseTrain,
    TrainEnd,
    TrainNode,
    TrainStart,
    Trigger,
    Entity,
    MovableEntity,
    PhysicalEntity,
    ExplosiveEntity,
    GunEntity,
    HealthyEntity,
    PickableEntity,
    Player,
    Weapon,
    Side,
    TeleportType,
    WeaponState,
    PlatformDirection,
    PhysicalModelType,
    PhysicalActivity,
    PlatformState,
    DoorState,
    Matrix2,
    Matrix3,
    Vector,
    Vector2,
    EventEmitter,
    Transport,
    IWorld,
    IWorldProps,
    WorldModuleEvents,
    WorldEvents,
    PreparedNetData,
    IPhysicalMesh,
    BaseModule,
    IBaseModuleContext,
    IMapObject,
    IMapEvent,
    IBasePhysicalModel,
    ITransportQueue,
    AbstractTransporter, ServerEvents,
    IForce,
    IPhysicsModule,
    IWorldPhysics,
    IDoor, IDoorProps, IDoorState,
    IPlatform, IPlatformState, IPlatformProps,
    IPlayerSpawn, IPlayerSpawnState, IPlayerSpawnProps,
    IPortal, IPortalState,
    IBaseTrain, IBaseTrainProps,
    ITrainEnd, ITrainEndState,
    ITrainNode, ITrainNodeState,
    ITrainStart, ITrainStartState,
    ITrigger,
    ICameoutMapEvent,
    ICollisionMapEvent,
    ICollisionStartMapEvent,
    ICollisionStopMapEvent,
    IDamageEvent,
    IPlayerRespawnEvent,
    IPlayerSpawnEvent,
    IPlayerTeleportEvent,
    IShootEvent,
    ITriggerEvent,
    IEntity, EntityFromStateFabric, IEntityParams, IEntityState,
    IMovableEntity, IMovableEntityState,
    IPhysicalEntity, IPhysicalEntityParams, IPhysicalEntityState,
    IExplosiveEntity, IExplosiveEntityParams, IExplosiveEntityState,
    IGunEntity, IGunEntityParams,
    IHealthyEntity, IHealthyEntityParams, IHealthyEntityState,
    IPickableEntity, IPickableEntityState,
    IPlayer, IPlayerParams, IPlayerState,
    IWeapon, IWeaponParams, IWeaponState,
    IKey,
    IVector,
    IVector2,
    Scene,
    PostEffect,
    PostEffectSystem,
    ClientWorld,
    ClientEngine,
    BaseMaterial,
    Texture2D,
    Texture3D,
    TextureCubemap,
    RenderTexture,
    RenderTextureCubemap,
    HTTPTransporter,
    ClientWSTransporter,
    OpenGLRenderer,
    BaseMesh,
    ColoredMaterial,
    DiffuseMaterial,
    FreeTexturedMaterial,
    PBRMaterial,
    PhongMaterial,
    ReflectiveMaterial,
    TexturedMaterial,
    ClientMapObject,
    ClientPortal,
    GLTFLoader,
    ClientMovableEntity,
    ClientPhysicalEntity,
    ViewableEntity,
    EffectEntity,
    ClientExplosiveEntity,
    ClientGunEntity,
    ClientHealthyEntity,
    LightEntity,
    ClientPickableEntity,
    ClientPlayer,
    ClientWeapon,
    BaseCamera,
    OrthogonalCamera,
    PerspectiveCamera,
    ThirdPersonViewCamera,
    ColorMode,
    CullMode,
    DrawMode,
    ReflectionType,
    SamplingMode,
    TextureFormat,
    VerticesMode,
    ViewType,
    TextureStorage, Texture2DStorage, Texture3DStorage, TextureCubemapStorage,
    ISprite,
    IShader,
    IScene,
    ISceneOpts,
    IPostEffectOpts,
    PostEffectEvents,
    IMesh,
    IMaterial,
    ClientWorldEvents,
    IBaseMesh,
    ITexture2D,
    ITexture3D,
    Texture2DOptions,
    Texture3DOptions,
    ITexture,
    TextureOptions,
    IRenderTextureOpts,
    ICubemapRenderTextureOpts,
    BaseGraphicsModule, BaseGraphicsModuleEvents,
    IGraphicsParameters,
    ClientGraphicsModuleEvents,
    IRegisteredMesh,
    IMeshOptions,
    IBaseMeshOptions,
    BaseMeshEvents,
    IBaseMaterialProps,
    IColoredMaterialProps,
    IPBRMaterialProps,
    IPhongMaterialProps,
    IReflectiveMaterialProps,
    ReflectableMaterialProps,
    ISpecularMaterialProps,
    ITexturedMaterialProps,
    IClientPortalProps,
    IClientMovableEntity,
    IClientPhysicalEntity, IClientPhysicalEntityParams,
    IViewableEntity, IViewableEntityParams,
    IEffectEntity,
    IClientExplosiveEntity, IClientExplosiveEntityParams,
    IClientGunEntity, IClientGunEntityParams,
    IClientHealthyEntity, IClientHealthyEntityParams,
    ILight, IBaseLightParams,
    IClientPickableEntity,
    IClientPlayer, IClientPlayerParams,
    IClientWeapon, IClientWeaponParams,
    TypedArray, GetArrayConstructor,
    IBaseCamera, IPerspectiveCamera, IOrthogonalCamera, Camera,
    IThirdPersonViewCamera,
    ServerWSTransporter
}