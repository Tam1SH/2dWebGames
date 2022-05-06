import React, { KeyboardEvent, useEffect } from 'react';
import './App.css';

type Point = {
    x : number
	y : number
}

type CellInfo = Point & {
	color : string;
}


interface IDestroyable {
	destroy() : void;
}

interface IUpdatable {
	update() : void;
}

const Cell : React.FC<CellInfo> = (props : CellInfo, context? : any) => {
	return (
		<div className='Cell'
		style = {{
				backgroundColor : 'green',
				borderColor : 'pink',
				borderWidth : '0px',
				left : props.x,
				top : props.y,
				color : props.color
		}}></div>
	)
}


let func : (e : KeyboardEvent) => void;

function wrapper(e : KeyboardEvent) { 
	func(e)
	console.log(e.code)
}

enum Direction { Left, Right, Up, Down }

class Apple extends React.Component<Point>  implements IDestroyable {
	render() { 
		return(
			<Cell 
			x={this.props.x}
			y={this.props.y}
			color={'red'}
			></Cell>
		)
	}
	destroy() {}
}
class GameLogic {
	subjects = Array<Sneak>()
	objects = Array<IDestroyable>()
	timer: NodeJS.Timer | null = null
	mainTick() {
	}
	constructor() {
		
		this.timer = setInterval(() => this.mainTick(), 50);
		this.subjects.push(new Sneak({}))
		this.subjects.forEach((e) => e.render());
	}
	getSubjects() : Array<JSX.Element> {
		return this.subjects.map((e) => e.render())
	}

}

class Sneak extends React.Component implements IUpdatable { 

	body = Array<Point>(5)
	
	valueMove : Point = { x : 40, y : 0}
	currentDirection : Direction | null = null
	blockChange : Boolean = false;
	applyDirection() {

		switch(this.currentDirection) {
			case Direction.Up : this.valueMove = { x: 0, y : -40}; break;
			case Direction.Down : this.valueMove = { x: 0, y : 40}; break;
			case Direction.Left : this.valueMove = { x : -40, y : 0}; break;
			case Direction.Right : this.valueMove = { x : 40, y : 0}; break;
		}

	}
	changeDirection(e : KeyboardEvent) {

		console.log(e.code)
		if(!this.blockChange) {

			if(e.code == "KeyW" && 
			this.currentDirection != Direction.Up && this.currentDirection != Direction.Down) 
			{
				this.currentDirection = Direction.Up
			}

			if(e.code == "KeyS" && 
			this.currentDirection != Direction.Down && this.currentDirection != Direction.Up)
			{
				this.currentDirection = Direction.Down
			}

			if(e.code == "KeyA" &&
			this.currentDirection != Direction.Left && this.currentDirection != Direction.Right) 
			{
				this.currentDirection = Direction.Left
			}
			if(e.code == "KeyD" &&
			this.currentDirection != Direction.Right && this.currentDirection != Direction.Left)
			{
				this.currentDirection = Direction.Right
			}

			this.blockChange = true;
		}
		
	}

 	update() {
		
		let item = this.body.at(this.body.length - 1);
		if(item) {

			let temp : Point = {x : 0, y : 0}

			Object.assign(temp, item)
		
			this.applyDirection()
			temp.x += this.valueMove.x;
			temp.y += this.valueMove.y;

			for(let i = 1; i < this.body.length; i++) {
				this.body[i - 1] = this.body[i];
			}

			this.body[this.body.length - 1] = temp;
		}

		this.setState({});
		this.blockChange = false;
	}

	render() {
		return (
			<div>
			{this.body.map((e) => {
				return <Cell x={e.x} y={e.y} color={'green'}></Cell>
			})}
			</div>
		)
	}

	constructor(props : any) {
		super(props);
		func = (e) => this.changeDirection(e);
		for(let i = 0; i < this.body.length; i++){
			this.body[i] = { x : 40 + 40 * i, y : 40};
		}
	}
}

function Cells() { 
	let cells = Array<JSX.Element>();

	for(let i = 0; i < 10; i++) {
		for(let j = 0; j < 10; j++) {
			cells.push(
				<div
				className='Cell'
				style = {{ top : 40 + i * 40, left : 40 + j * 40}}
				>				
			</div>
			)
		}
	}	
	return cells;
}


class App extends React.Component { 
	logic : GameLogic | null = null;
	render() {
		this.logic = new GameLogic();
		return (
			<div
			onKeyDown ={wrapper}
			style={{width : '100%', height : '100%', backgroundColor : '#3ced21', position : 'absolute'}}
			tabIndex ={0}
			>
				{this.logic.getSubjects()}
			</div>
		);
	}
}

export default App;
