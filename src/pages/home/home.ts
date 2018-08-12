//ionic cordova plugin add cordova-sqlite-storage
//npm install --save @ionic-native/sqlite
//ionic cordova plugin add cordova-plugin-x-toast
//npm install --save @ionic-native/toast


import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AddDataPage } from '../add-data/add-data';
import { EditDataPage } from '../edit-data/edit-data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

constructor(public navCtrl: NavController, private sqlite: SQLite) { }

gastos: any = [];
totalRecebido = 0;
totalGasto = 0;
saldo = 0;

ionViewDidLoad() {
  this.pegaDados();
}

ionViewWillEnter() {
  this.pegaDados();
}

pegaDados() {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS gastos(id INTEGER PRIMARY KEY, data TEXT, tipo TEXT, descricao TEXT, valor REAL)', {})
    .then(res => console.log('Executou SQL'))
    .catch(e => console.log(e));

    //seleciona tudo e popula o array gastos
    db.executeSql('SELECT * FROM gastos ORDER BY id DESC', {})
    .then(res => {
      this.gastos = [];
      for(var i=0; i < res.rows.length; i++) {
        this.gastos.push({id: res.rows.item(i).id,
                          data: res.rows.item(i).data,
                          tipo: res.rows.item(i).tipo,
                          descricao: res.rows.item(i).descricao,
                          valor: res.rows.item(i).valor})
      }
    })
    .catch(e => console.log(e));


    //soma tudo o que for despesa
    db.executeSql('SELECT SUM(valor) AS totalRecebido FROM gastos WHERE tipo="Despesa"', {})
    .then(res => {
      if(res.rows.length > 0) {
        this.totalRecebido = parseInt(res.rows.item(0).totalRecebido);
        this.saldo = this.totalRecebido-this.totalGasto;
      }
    })
    .catch(e => console.log(e));


    //soma tudo o que for receita
    db.executeSql('SELECT SUM(valor) AS totalGasto FROM gastos WHERE tipo="Receita"', {})
    .then(res => {
      if(res.rows.length>0) {
        this.totalGasto = parseInt(res.rows.item(0).totalGasto);
        this.saldo = this.totalRecebido-this.totalGasto;
      }
    })
  }).catch(e => console.log(e));
}//pegaDados termina aqui


addDados() {
  this.navCtrl.push(AddDataPage);
}

editaDados(id) {
  this.navCtrl.push(EditDataPage, {
    id:id
  });
}

deletaDados(id) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM gastos WHERE id=?', [id])
    .then(res => {
      console.log(res);
      this.pegaDados();
    })
    .catch(e => console.log(e));
  }).catch(e => console.log(e));
}

}
