import { Component, Input, OnInit } from '@angular/core';
import { Article } from '../../interfaces';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx'
import { ActionSheetButton, ActionSheetController, Platform } from '@ionic/angular';
import {SocialSharing} from '@ionic-native/social-sharing/ngx'
import { Source } from '../../interfaces/index';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent {

  @Input() article: Article;
  @Input() index:number;


  constructor(
    private iab:InAppBrowser, 
    private platform:Platform, 
    private actionSheetCtrl: ActionSheetController,
    private socialSharing: SocialSharing,
    private storageService:StorageService) { }

  openArticle(){

    if(this.platform.is('ios') || this.platform.is('android')){
      const browser = this.iab.create(this.article.url)
      browser.show()  
      return   
    }

     window.open(this.article.url, '_blank')
  }

 async onOpenMenu(){

  const normalBts:ActionSheetButton[]=[
    {
    text:'Favorito',
    icon:'heart-outline',
    handler:()=>this.onToggleFavorite()
    },
    {
      text: 'Cancelar',
      icon:'close-outline',
      role:'cancel'
    }]

  const btn: ActionSheetButton = {
    text:'Compartir',
    icon:'share-outline',
    handler:()=>this.onShareArticle()
    }

    if(this.platform.is('capacitor')){
      normalBts.unshift(btn)
    }

  const actionSheet= await this.actionSheetCtrl.create({

    header:'Opciones',
    buttons: normalBts

  })





    await actionSheet.present()

  }
  onShareArticle(){

    const {title,source,url}=this.article

    this.socialSharing.share(
      title,
      source.name,
      null,
      url
    )
  }

  onToggleFavorite(){
    this.storageService.saveRemoveArticle(this.article)
  }

}
