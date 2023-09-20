class SceneMain extends Phaser.Scene
{
  constructor()
  {
    super('SceneMain');
  }

  preload()
  {
    this.load.spritesheet('blocks', 'images/blocks.png', {frameWidth: 64, frameHeight: 84});
    this.load.image('buttonPlayAgain', 'images/btnPlayAgain.png');
  }
  
  create()
  {
    this.blockGroup = this.add.group();
    this.clickLock = false;
    this.colorArray = [];
    this.centerBlock = null;

    for (let i = 0; i < 25; i++) {
      const color = Phaser.Math.Between(0, model.numberOfColors);
      this.colorArray.push(color);
    }

    const blockWidth = game.config.width / 5;
    const blocHeight = game.config.height / 5;
    let xx = blockWidth / 2;
    let yy = blocHeight / 2;
    let currentIteration = 0;

    for (let i = 0; i < 5; i++)
    {
      for (let j = 0; j < 5; j++)
      {
        let block = this.add.image(0, 0, 'blocks');
        this.blockGroup.add(block);
        block.displayWidth = blockWidth;
        block.displayHeight = blocHeight;
        block.x = xx;
        block.y = yy;
        block.setFrame(this.colorArray[currentIteration]);

        if(i == 2 && j == 2)
        {
          this.centerBlock = block;
        }
        else
        {
          block.setInteractive();
        }

        xx += blockWidth;
        currentIteration++;
      }

      xx = blockWidth / 2;
      yy += blocHeight;
    }

    this.colorArray[12] = -1;
    this.pickColor();

    this.input.on('gameobjectdown', this.selectBlock, this);

    this.timer = new CircleTimer({scene: this});
    this.timer.x = this.centerBlock.x;
    this.timer.y = this.centerBlock.y;
    this.timer.setCallback(this.timeUp, this);
    this.timer.start();

    this.scoreText = this.add.text(0, 0, '0', {fontSize: game.config.width / 10, color: '#000000'});
    this.scoreText.setOrigin(0.5, 0.5);
    Align.center(this.scoreText);
  }

  pickColor()
  {
    if(this.colorArray.length == 0)
    {
      model.numberOfColors++;

      if(model.numberOfColors > 7)
      {
        model.numberOfColors = 7;
      }

      this.scene.restart();
      return;
    }

    const index = Phaser.Math.Between(0, this.colorArray.length - 1);
    const color = this.colorArray.splice(index, 1)[0];
    if(color == -1)
    {
      this.pickColor();
      return;
    }

    this.centerBlock.setFrame(color);
  }

  selectBlock(pointer, block)
  {
    if(this.clickLock) return;

    if(block.frame.name === this.centerBlock.frame.name)
    {
      block.removeInteractive();
      this.fall(block);
      this.pickColor();

      model.score++;
      this.scoreText.text = model.score;

      model.audioManager.playSound('right');

      let effect = new Effect({scene: this, effectNumber: model.effectNumberRight});
      effect.x = block.x;
      effect.y = block.y;
    }
    else
    {
      let effect = new Effect({scene: this, effectNumber: model.effectNumberWrong});
      effect.x = block.x;
      effect.y = block.y;

      this.gameOver();
      return;
    }

    this.timer.reset();
  }

  fall(block)
  {
    this.tweens.add({targets: block, duration: 1000, scaleX: 0, scaleY: 0});
  }

  timeUp()
  {
    this.gameOver();
  }

  gameOver()
  {
    model.audioManager.stopBackgroundMusic();
    model.audioManager.playSound('wrong');
    this.clickLock = true;
    this.timer.stop();
    this.timer.visible = false;
    this.blockGroup.children.iterate(function(block) {
      this.fall(block);
    }.bind(this));

    this.time.addEvent({delay: 1200, callback: this.goToSceneOver, callbackScope: this, loop: false});
  }

  goToSceneOver()
  {
    this.scene.start('SceneOver');
  }
}