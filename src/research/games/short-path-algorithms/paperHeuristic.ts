/*
 * Screen-scale implementation of Section 4 of Bezdek--Henderschedt,
 * "Evade a square and go straight towards the target".
 *
 * The game draws the obstacle a little larger for the mathematical path
 * (2 units clearance, rather than the player's 0.8-unit collision radius),
 * and uses the shorter square-boundary detour for the paper's terminal
 * 'return to line' step. Distances returned are in arena units.
 */
export type PathPoint = { x: number; y: number }
export type PathSquare = { id: number; cx: number; cy: number; size: number; angle: number }
export type AlgorithmPath = { points: PathPoint[]; length: number; usedFallback: boolean }

const CLEARANCE = 2.0
const EPS = 1e-7
const BOARD = { minX: 2, maxX: 998, minY: 2, maxY: 558 }

function distance(a: PathPoint, b: PathPoint) {
  return Math.hypot(a.x-b.x, a.y-b.y)
}
function local(p: PathPoint, sq: PathSquare): PathPoint {
  const x=p.x-sq.cx,y=p.y-sq.cy,c=Math.cos(sq.angle),s=Math.sin(sq.angle)
  return {x:c*x+s*y,y:-s*x+c*y}
}
function global(p: PathPoint, sq: PathSquare): PathPoint {
  const c=Math.cos(sq.angle),s=Math.sin(sq.angle)
  return {x:sq.cx+c*p.x-s*p.y,y:sq.cy+s*p.x+c*p.y}
}
function half(sq: PathSquare){ return sq.size/2+CLEARANCE }
function corners(sq: PathSquare): PathPoint[] {
  const h=half(sq)
  return [{x:-h,y:-h},{x:h,y:-h},{x:h,y:h},{x:-h,y:h}].map(p=>global(p,sq))
}
// Intersections with an offset square. Point vs square clearance is > game's 0.8.
function segmentHit(a: PathPoint,b: PathPoint,sq: PathSquare): {enter:number;exit:number}|null {
  const p=local(a,sq),q=local(b,sq),h=half(sq)
  let enter=0,exit=1
  for (const axis of ['x','y'] as const){
    const v=q[axis]-p[axis]
    if(Math.abs(v)<1e-12){if(p[axis]<-h||p[axis]>h)return null;continue}
    const t1=(-h-p[axis])/v,t2=(h-p[axis])/v
    enter=Math.max(enter,Math.min(t1,t2))
    exit=Math.min(exit,Math.max(t1,t2))
    if(enter>exit+EPS)return null
  }
  if(exit<=EPS||enter>=1-EPS)return null
  return {enter,exit}
}
function interpolate(a:PathPoint,b:PathPoint,t:number):PathPoint{
  return {x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}
}
function firstHit(a:PathPoint,b:PathPoint,obstacles:PathSquare[]){
  let hit: {sq:PathSquare;enter:PathPoint;exit:PathPoint;t:number}|null=null
  for(const sq of obstacles){
    const found=segmentHit(a,b,sq)
    if(found && (!hit || found.enter<hit.t)){
      hit={sq,enter:interpolate(a,b,found.enter),exit:interpolate(a,b,found.exit),t:found.enter}
    }
  }
  return hit
}
function boundaryPosition(p:PathPoint,sq:PathSquare):number{
  const h=half(sq),v=local(p,sq)
  const edges=[Math.abs(v.y+h),Math.abs(v.x-h),Math.abs(v.y-h),Math.abs(v.x+h)]
  const which=edges.indexOf(Math.min(...edges))
  if(which===0)return Math.max(0,Math.min(2*h,v.x+h))
  if(which===1)return 2*h+Math.max(0,Math.min(2*h,v.y+h))
  if(which===2)return 4*h+Math.max(0,Math.min(2*h,h-v.x))
  return 6*h+Math.max(0,Math.min(2*h,h-v.y))
}
// Forward/backward arc along the boundary between two points, including corners.
function boundaryArc(a:PathPoint,b:PathPoint,sq:PathSquare,forward:boolean):PathPoint[]{
  const h=half(sq),perimeter=8*h,t0=boundaryPosition(a,sq),t1=boundaryPosition(b,sq)
  const vertices=corners(sq)
  const result:PathPoint[]=[]
  if(forward){
    const stop=t1+(t1<t0-EPS?perimeter:0)
    for(let step=1;step<=4;step++){
      const x=Math.ceil((t0+EPS)/(2*h))*2*h+(step-1)*2*h
      if(x<stop-EPS)result.push(vertices[(Math.round(x/(2*h)))%4])
    }
  }else{
    const stop=t1-(t1>t0+EPS?perimeter:0)
    for(let step=1;step<=4;step++){
      const x=Math.floor((t0-EPS)/(2*h))*2*h-(step-1)*2*h
      if(x>stop+EPS)result.push(vertices[((Math.round(x/(2*h))%4)+4)%4])
    }
  }
  result.push(b)
  return result
}
function routeLength(start:PathPoint,route:PathPoint[]){
  let n=0,p=start
  for(const q of route){n+=distance(p,q);p=q}
  return n
}
function shortestBoundary(a:PathPoint,b:PathPoint,sq:PathSquare):PathPoint[]{
  const cw=boundaryArc(a,b,sq,true),ccw=boundaryArc(a,b,sq,false)
  return routeLength(a,cw)<=routeLength(a,ccw)?cw:ccw
}
function oppositeCorners(entry:PathPoint,sq:PathSquare){
  const t=boundaryPosition(entry,sq),h=half(sq)
  const face=Math.min(3,Math.floor((t+1e-5)/(2*h)))
  const verts=corners(sq)
  // entry face 0 is bottom, so opposite face 2 corners are 2 and 3
  return [verts[(face+2)%4],verts[(face+3)%4]]
}
function goalClip(points:PathPoint[],goal:PathPoint,radius:number):PathPoint[]{
  const result=[points[0]]
  for(let i=1;i<points.length;i++){
    const a=result[result.length-1],b=points[i]
    const av={x:a.x-goal.x,y:a.y-goal.y},v={x:b.x-a.x,y:b.y-a.y}
    const A=v.x*v.x+v.y*v.y,B=2*(av.x*v.x+av.y*v.y),C=av.x*av.x+av.y*av.y-radius*radius
    if(C<=0)return result
    const disc=B*B-4*A*C
    if(disc>=0&&A>0){
      const t=(-B-Math.sqrt(disc))/(2*A)
      if(t>=0&&t<=1){result.push(interpolate(a,b,t));return result}
    }
    result.push(b)
  }
  return result
}
function insideBoard(p:PathPoint){return p.x>=BOARD.minX&&p.x<=BOARD.maxX&&p.y>=BOARD.minY&&p.y<=BOARD.maxY}

// A last-resort visibility fallback for unexpected numerical degeneracies,
// explicitly marked so the website does not attribute it to the paper's heuristic.
function visibilityFallback(start:PathPoint,end:PathPoint,squares:PathSquare[]):PathPoint[]|null{
  const nodes=[start,end,...squares.flatMap(corners)]
  const graph:{to:number;w:number}[][]=nodes.map(()=>[])
  for(let i=0;i<nodes.length;i++){
    if(!insideBoard(nodes[i]))continue
    for(let j=i+1;j<nodes.length;j++){
      if(!insideBoard(nodes[j]))continue
      const cross=squares.some(sq=>{
        const h=segmentHit(nodes[i],nodes[j],sq)
        // touching at segment endpoints is okay; traversing an obstacle is not
        return h && h.exit-h.enter>1e-6
      })
      if(!cross){const w=distance(nodes[i],nodes[j]);graph[i].push({to:j,w});graph[j].push({to:i,w})}
    }
  }
  const distances=nodes.map(()=>Infinity),previous=nodes.map(()=>-1),done=nodes.map(()=>false)
  distances[0]=0
  for(let step=0;step<nodes.length;step++){
    let at=-1
    for(let i=0;i<nodes.length;i++)if(!done[i]&&(at<0||distances[i]<distances[at]))at=i
    if(at<0||!Number.isFinite(distances[at]))break
    if(at===1)break
    done[at]=true
    for(const e of graph[at])if(distances[at]+e.w<distances[e.to]){
      distances[e.to]=distances[at]+e.w;previous[e.to]=at
    }
  }
  if(!Number.isFinite(distances[1]))return null
  const rev:PathPoint[]=[]
  for(let k=1;k!==-1;k=previous[k])rev.push(nodes[k])
  return rev.reverse()
}

export function computePaperHeuristicPath(
  obstacles:PathSquare[],
  start:PathPoint={x:100,y:280},
  target:PathPoint={x:900,y:280},
  goalRadius=35.2,
):AlgorithmPath|null{
  let position={...start}
  let path=[{...start}]
  const maxSize=Math.max(1,...obstacles.map(sq=>sq.size))
  const d=distance(start,target)/maxSize
  const nearThreshold=2*Math.sqrt(d)*maxSize
  let usedFallback=false
  const remember=(q:PathPoint)=>{
    if(distance(path[path.length-1],q)>1e-5){path.push(q);position=q}
  }

  for(let iteration=0;iteration<obstacles.length*5+30;iteration++){
    if(distance(position,target)<=goalRadius+EPS)break
    const hit=firstHit(position,target,obstacles)
    if(!hit){remember(target);break}
    remember(hit.enter)

    let next:PathPoint[]|null=null
    // The paper's large-distance step: advance around the square to a
    // far-side corner with forward progress >= 2/3 of the detour length.
    const entryFace = Math.floor((boundaryPosition(hit.enter,hit.sq)+1e-5)/(2*half(hit.sq)))%4
    const exitFace = Math.floor((boundaryPosition(hit.exit,hit.sq)+1e-5)/(2*half(hit.sq)))%4
    const oppositeFaces = (exitFace-entryFace+4)%4===2
    if(oppositeFaces && distance(hit.enter,target)>nearThreshold){
      const dir={x:(target.x-hit.enter.x)/distance(hit.enter,target),y:(target.y-hit.enter.y)/distance(hit.enter,target)}
      const candidates=oppositeCorners(hit.enter,hit.sq)
      let best: {points:PathPoint[];score:number}|null=null
      for(const corner of candidates){
        const trial=shortestBoundary(hit.enter,corner,hit.sq)
        const cost=routeLength(hit.enter,trial)
        const gain=(corner.x-hit.enter.x)*dir.x+(corner.y-hit.enter.y)*dir.y
        // require forward progress, and no immediate jump back through the square
        if(cost<1e-4||gain/cost<2/3-1e-8)continue
        const selfCollision=segmentHit(corner,target,hit.sq)
        if(selfCollision&&selfCollision.enter<1e-5&&selfCollision.exit>1e-5)continue
        const score=gain/cost
        if(!best||score>best.score)best={points:trial,score}
      }
      if(best)next=best.points
    }
    // Terminal return-to-line step, and the adjacent-edge case:
    // follow the shorter boundary detour to the original ray's exit.
    if(!next)next=shortestBoundary(hit.enter,hit.exit,hit.sq)
    const before=position
    for(const p of next)remember(p)
    if(distance(before,position)<1e-5)break
    if(!insideBoard(position))break
  }

  if(distance(position,target)>goalRadius+EPS){
    const backup=visibilityFallback(start,target,obstacles)
    if(!backup)return null
    path=backup;usedFallback=true
  }
  path=goalClip(path,target,goalRadius)
  let length=0
  for(let i=1;i<path.length;i++)length+=distance(path[i-1],path[i])
  return {points:path,length,usedFallback}
}
