export class Enemy {
    constructor(name, health, damage, speed, goldAmount, colour) {
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.x = -1;
        this.y = 1;
        this.pathIndex = 0;
        this.goldAmount = goldAmount;
        this.colour = colour;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // move() {
    //     if (this.pathIndex < this.path.length - 1) {
    //         console.log("Path:", this.path);
    //         console.log("Path index:", this.pathIndex);
    
    //         const nextPoint = this.path[this.pathIndex + 1];
    //         console.log("Next point:", nextPoint);
    
    //         const dx = nextPoint[0] - this.x;
    //         const dy = nextPoint[1] - this.y;
    //         console.log("dx:", dx, "dy:", dy);
    
    //         if (dx !== 0 || dy !== 0) { // Check if dx and dy are both not zero
    //             const distance = Math.sqrt(dx * dx + dy * dy);
    
    //             const directionX = dx / distance;
    //             const directionY = dy / distance;
    
    //             this.x += directionX * this.speed;
    //             this.y += directionY * this.speed;
    
    //             console.log("New position:", this.x, this.y);
    //         }
    
    //         // Check if the enemy has reached the next point in the path
    //         if (Math.abs(this.x - nextPoint[0]) < this.speed && Math.abs(this.y - nextPoint[1]) < this.speed) {
    //             this.pathIndex++;
    //             console.log("Next point reached, path index updated:", this.pathIndex);
    //         }
    //     }
    // }    
}