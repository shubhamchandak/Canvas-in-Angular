import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Box } from './models/box';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  title = 'Box Game';
  currentZIndex = 0;
  buttonText: string;
  keyBoardControl: boolean = true;
  boxArray:Box[] = [];
  mouseClickListner: any;
  keyboardListner: any;
  boxWidth: number = 100;
  boxHeight: number = 100;
  canvasWidth: number = 1000;
  canvasHeight: number = 500;
  selectedBoxIndex: number = -1;
  currentId: number = 0;
  
  @ViewChild('myCanvas', { static: false })
  myCanvas?: ElementRef<HTMLCanvasElement>; 
  ctx: CanvasRenderingContext2D;

  ngAfterViewInit() {
    this.toggleKeyboardControl();
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.myCanvas.nativeElement.width = this.canvasWidth;
    this.myCanvas.nativeElement.height = this.canvasHeight;
  }
  
  onMouseClick(event) {
    let bound = this.myCanvas.nativeElement.getBoundingClientRect();
    let x = event.clientX - bound.left - this.myCanvas.nativeElement.clientLeft;
    let y = event.clientY - bound.top - this.myCanvas.nativeElement.clientTop;
    if(this.selectedBoxIndex >= 0) this.boxArray[this.selectedBoxIndex].highlight = false;
    this.selectedBoxIndex = -1;
    this.boxArray.forEach((b,i) => {
      if(b.xPosition <= x && x <= b.xPosition + this.boxWidth && b.yPosition <= y && y < b.yPosition + this.boxHeight) {
        this.selectedBoxIndex = i;
      }
    });
    if(this.selectedBoxIndex >= 0) {
      this.boxArray[this.selectedBoxIndex].highlight = true;
      this.draw();
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if(this.selectedBoxIndex < 0 || this.selectedBoxIndex >= this.boxArray.length) return;
    console.log(this.myCanvas.nativeElement.height, this.boxArray[this.selectedBoxIndex].yPosition+2);
    if(event.code.toLowerCase() == "keyw") this.boxArray[this.selectedBoxIndex].yPosition = Math.max(0, this.boxArray[this.selectedBoxIndex].yPosition-2);
    else if(event.code.toLowerCase() == "keys") this.boxArray[this.selectedBoxIndex].yPosition = Math.min(this.myCanvas.nativeElement.height-this.boxHeight, this.boxArray[this.selectedBoxIndex].yPosition+2);
    else if(event.code.toLowerCase() == "keya") this.boxArray[this.selectedBoxIndex].xPosition = Math.max(0, this.boxArray[this.selectedBoxIndex].xPosition-2);
    else if(event.code.toLowerCase() == "keyd") this.boxArray[this.selectedBoxIndex].xPosition = Math.min(this.myCanvas.nativeElement.width-this.boxWidth, this.boxArray[this.selectedBoxIndex].xPosition+2);
    else if(event.code.toLowerCase() == "delete") {
      this.boxArray.splice(this.selectedBoxIndex, 1);
      this.selectedBoxIndex = -1;
    }
    this.draw();
  }

  toggleKeyboardControl() {
    this.keyBoardControl = !this.keyBoardControl;
    if(this.keyBoardControl) {
      this.buttonText = "Click to Disable Control";
      this.mouseClickListner = this.onMouseClick.bind(this);
      this.myCanvas.nativeElement.addEventListener('click', this.mouseClickListner);
      this.keyboardListner = this.onKeyPress.bind(this);
      window.addEventListener('keydown', this.keyboardListner)
    }
    else {
      this.buttonText = "Click to Enable Control";
      this.myCanvas.nativeElement.removeEventListener('click', this.mouseClickListner);
      window.removeEventListener('keydown', this.keyboardListner);
    }
    if(this.selectedBoxIndex >= 0) this.boxArray[this.selectedBoxIndex].highlight = false;
  }

  addBox() {
    let box: Box = {
      height: this.boxWidth,
      width: this.boxHeight,
      xPosition: Math.max(0, Math.random()*this.canvasWidth - this.boxWidth),
      yPosition: Math.max(0, Math.random()*this.canvasHeight - this.boxHeight),
      color: `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 1)`,
      id: ++this.currentId,
      highlight: false
    };
    this.boxArray.push(box);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.boxArray.forEach(b => {
      this.ctx.fillStyle = b.color;
      this.ctx.fillRect(b.xPosition, b.yPosition, b.width, b.height);
      this.ctx.fillStyle = "white";
      this.ctx.font = "20px Arial";
      this.ctx.fillText(b.id.toString(), b.xPosition+40, b.yPosition+40);
      if(b.highlight) {
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(b.xPosition, b.yPosition, b.width, b.height);
      }
    });
  }

  reset() {
    this.selectedBoxIndex = -1;
    this.boxArray = [];
    this.currentId = 0;
  }

}
