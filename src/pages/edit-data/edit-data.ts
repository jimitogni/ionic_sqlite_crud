import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-edit-data',
  templateUrl: 'edit-data.html',
})
export class EditDataPage {

  dados = { id:0, data:"", tipo:"", descricao:"", saldo:0 };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private sqlite: SQLite,
    private toast: Toast) {
      this.getCurrentData(navParams.get("id"));
  }

  getCurrentData(id) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM gastos WHERE id=?', [id])
        .then(res => {
          if(res.rows.length > 0) {
            this.dados.id = res.rows.item(0).id;
            this.dados.data = res.rows.item(0).data;
            this.dados.tipo = res.rows.item(0).tipo;
            this.dados.descricao = res.rows.item(0).descricao;
            this.dados.saldo = res.rows.item(0).valor; //aqui pode estar errado valor ou saldo
          }
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  atualizaData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => { //na linha de baixo pode ser valor ou saldo
      db.executeSql('UPDATE gastos SET data=?,tipo=?,descricao=?,valor=? WHERE id=?',[this.dados.data,this.dados.tipo,this.dados.descricao,this.dados.saldo,this.dados.id])
        .then(res => {
          console.log(res);
          this.toast.show('Dados atualizados com sucesso', '5000', 'center').subscribe(
            toast => {
              this.navCtrl.popToRoot();
            }
          );
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(e);
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

}
