export class Tower {
    constructor(name, attackSpeed, damage, cost, range, sellValue, colour) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.attackSpeed = attackSpeed;
        this.damage = damage;
        this.cost = cost;
        this.range = range;
        this.sellValue = sellValue;
        this.colour = colour;
        this.cooldown = false;
    }

    placeTower(x, y) {
        this.x = x;
        this.y = y;
    }
}