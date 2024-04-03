export class Enemy {
    constructor(name, health, damage, speed, goldAmount, colour) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
        this.pathIndex = 0;
        this.goldAmount = goldAmount;
        this.colour = colour;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    } 
}