class SceneTitle extends Phaser.Scene
{
  constructor()
  {
    super('SceneTitle');
  }
  
  create()
  {
    this.buttonTitleBack = this.add.image(0, 0, 'buttonTitleBack');
    this.buttonTitleBack.setOrigin(0, 0);
    this.buttonTitleBack.displayWidth = game.config.width;
    this.buttonTitleBack.displayHeight = game.config.height;

    model.audioManager.playBackgroundMusic();

    this.aGrid = new AlignGrid({scene: this, rows: 11, cols: 11});
    //this.aGrid.showNumbers();

    this.titleText = this.add.text(0, 0, 'QUICK\nBLOCKS', {fontSize: game.config.width / 5, color: '#ff0000'});

    this.buttonInstructions = new TextButton({scene: this, callback:this.showInstructions, callbackScope: this, key: 'green', text: 'How To Play', scale: 0.45, textScale: 20, textColor: '#000000'});
    this.aGrid.placeAtIndex(36, this.buttonInstructions);

    this.buttonStart = new TextButton({scene: this, callback:this.startGame, callbackScope: this, key: 'blue', text: 'Start Game', scale: 0.45, textScale: 20, textColor: '#000000'});
    Align.center(this.buttonStart);

    this.buttonSettings = new TextButton({scene: this, callback:this.showSettings, callbackScope: this, key: 'orange', text: 'Settings', scale: 0.45, textScale: 20, textColor: '#000000'});
    this.aGrid.placeAtIndex(84, this.buttonSettings);
  }

  showInstructions()
  {
    this.scene.start('SceneInstructions');
  }
  
  startGame()
  {
    this.scene.start('SceneMain');
  }

  showSettings()
  {
    this.scene.start('SceneSettings');
  }
}