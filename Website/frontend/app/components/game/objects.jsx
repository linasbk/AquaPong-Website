export class Player  {

    constructor(x , y , color, width , height , score){

        this.x = x;
        this.y = y;
        this.color = color;
        this.height = height;
        this.width = width;
        this.score = score;
    }
    get getX() { return this.x};
    get getY() { return this.y}
    get getW () { return  this.width };
    get getH () { return this.height}
    get Score() {return this.score;};
    get Color() { return this.color};
    set positionX(x){this.x = x;};
    set positionY(y){this.y = y;};
    set newScore(newScore) { this.score = newScore};
}

export class Ball  {

    constructor(x , y , color, size, speed ){

        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speed = speed;
    }
    get getX() { return this.x };
    get getY() { return  this.y };
    get Size () { return this.size};
    get Speed() { return this.speed};
    set positionX(x){this.x = x;};
    set positionY(y){this.y = y;};
    // set speed(newspeed){this.speed = newspeed};

}