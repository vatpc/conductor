import { Component, OnInit } from '@angular/core';
import { Servicio } from '../comun/servicio';
import { Conductor } from '../comun/conductor';
import { ConductorPeticion } from '../comun/conductor-peticion';
import { Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { SempresasService } from '../servicios/sempresas.service';
import { SconductoresService } from '../servicios/sconductores.service';
import { SserService } from '../servicios/sser.service';
import { HttpModule } from '@angular/http';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Empresas } from '../comun/empresas';
import { Compania } from '../comun/compania';
import { CompaniaPeticion } from '../comun/compania-peticion';
import { Propietario } from '../comun/propietario';
import { Vehiculo } from '../comun/vehiculo';

@Component({
  selector: 'app-vtc',
  templateUrl: './vtc.component.html',
  styleUrls: ['./vtc.component.css'],
  providers: [SconductoresService, SempresasService, SserService]
})
export class VtcComponent implements OnInit {
  @Input() servicio: Servicio;
  @Output() cerrarConductorEvento = new EventEmitter();
  @Output() actualizaListaEvento = new EventEmitter();
  empresa: Empresas;
  conductor: Conductor;
  compania: Compania;
  propietario:Propietario;
  vehiculo: Vehiculo;
  tmr:string;
  //casero
  arrendadorNombre:string;
  arrendadorCIF:string;
  arrendadorDIR:string;
  //inquilino
  arrendatarioNombre:string;
  arrendatarioCIF:string;
  arrendatarioDIR:string;
  
  copias = 5;
  repeticiones = -1;
  idActual =0;
  pos =-1;


  title = 'LUXUCAR';
  dd: any;
  pdfDocGenerator: any;

  constructor(private sempresas: SempresasService, private scon: SconductoresService,private sser: SserService) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }
  ngOnInit() {
    moment.locale('es');
    this.getEmpresa(this.servicio.idEmpresa);
    this.getConductor(this.servicio.idConductor);
    this.getPropietario();
    // console.log('this.empresas=' + JSON.stringify(this.empresas));
  }
  getVehiculos(idVehiculo:string){
    const vehiculo={'id':idVehiculo};
    this.scon.getVehiculos(JSON.stringify(vehiculo)).subscribe(result => {
      for (const prop of result) {
        this.vehiculo = prop;
        break;
     }
    });
  }
  getPropietario(){
    this.sser.getPropietario().subscribe(result =>{
      for (const prop of result) {
        this.propietario = prop;
        this.tmr  = moment(this.servicio.FechaDeRecogida).add(+this.servicio.tiempoMedioServicio,'minutes').add(+this.propietario.tAjusteFinalTrayVTC,'minutes').format('LTS');
       
        this.arrendatarioNombre=this.propietario.nombre;
        this.arrendatarioCIF=this.propietario.cif;
        this.arrendatarioDIR=this.propietario.direccion;
       
        break;
     }
   });
  }
  
  verVTC() {
    this.getPDF();
    this.pdfDocGenerator.open();
  }
  downloadVTC() {
    this.getPDF();
    this.pdfDocGenerator.download('Luxucar_vtc_' + this.servicio.idservicio + '.pdf');
  }
  imprimirVTC() {
    this.getPDF();
    this.pdfDocGenerator.print();
  }
  getEmpresa(idEmpresa: string) {
    let empresas: Empresas[];
    const empres = {'id': idEmpresa};
    this.sempresas.getEmpresa(JSON.stringify(empres)).subscribe(result => {
      empresas = result;
      for (const emp of empresas){
          this.empresa = emp;
      }
    });

  }
  getConductor(idConductor: string) {
    const conduct =  new ConductorPeticion();
    conduct.id = idConductor;
    this.scon.getConductores(conduct).subscribe(result => {
      const conductores = result;
      for (const con of conductores){
          this.conductor = con;
          this.getcompanias(this.conductor.idCompania);
          this.getVehiculos(this.conductor.idVehiculo);
      }
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // verVTCSer() {
  //     this.pos++;
  //     this.repeticiones++;
  //     /* let a =[
  //       (44742),(44744),(44827),(44833),(44849),(44854),(44855),(44856),(44857),(44859),(44860),(44861),(44862),(44882),(44928),
  //       (44929),(44930),(44931),(44932),(44933),(44944),(44945),(44946),(44947),(44948),(44950),(44994),(45012),(45013),(45014),(45028),(45029),
  //       (45030),(45034),(45045),(45046),(45047),(45048),(45087),(45151),(45152),(45153),(45154),(45155),(45156),(45157),(45158),(45165),(45166),(45168),
  //       (45189),(45191),(45192),(45193),(45194),(45195),(45196),(45197),(45198),(45199),(45200),(45203),(45204),(45205),(45206),(45207),(45208),
  //       (45210),(45211),(45214),(45215),(45216),(45217),(45218),(45219),(45220),(45221),(45222),(45223),(45224),(45225),(45226),(45227),
  //       (45228),(45229),(45231),(45232),(45233),(45234),(45235),(45236),(45237),(45238),(45240),(45241),(45242),(45243),(45244),(45245),(45246),
  //       (45247),(45248),(45249),(45250),(45251),(45252),(45253),(45254),(45255),(45256),(45257),(45258),(45259),(45260),(45261),(45262),(45263),
  //       (45264),(45265),(45266),(45267),(45268),(45269),(45270),(45272),(45273),(45274),(45275),(45276),(45277),(45278),(45279),(45280),(45281),(45282),
  //       (45283),(45284),(45285),(45286),(45287),(45288),(45290),(45291),(45292),(45293),(45294),(45295),(45296),(45297),(45298),(45299),
  //       (45300),(45301),(45302),(45303),(45304),(45305),(45306),(45307),(45308),(45309),(45310),(45312),(45313),(45315),(45316),(45317),(45318),
  //       (45319),(45320),(45321),(45322),(45323),(45324),(45325),(45340),(45341),(45343),(45344),(45345),(45346),(45347),(45348),(45349),(45350),(45351),(45352),(45353),
  //       (45354),(45355),(45356),(45358),(45359),(45360),(45361),(45362),(45363),(45364),(45365),(45366),(45371),(45372),(45373),(45374),(45375),(45378),
  //       (45381),(45382),(45383),(45384),(45388),(45389),(45390),(45392),(45395),(45396),(45397),(45399),(45400),(45401),(45402),
  //       (45406),(45407),(45408),(45409),(45410),(45412),(45413),(45414),(45415),(45416),(45417),(45418),(45419),(45421),(45422),(45426),(46639)
  //     ];*/
  //     console.log('pos--->',this.pos);
  //     console.log('pos--->',this.pos);
  //     let a=[(45345),
  //       (45409),
  //       (45014)];

  //     this.idActual = a[this.pos];
  //     if(this.repeticiones>= this.copias) {
  //       console.log('this.idActual--->',this.idActual);
  //       console.log('this.pos--->',this.pos);
  //       this.repeticiones = 0;
  //     }else{
  //       this.verVTCSerC(this.idActual);
  //     }
        
  // }
  // verVTCSerC(idSer: number ) { 
  //    const datos = { 'idservicio': idSer };
  //    this.sser.getServicio(JSON.stringify(datos)).subscribe(result=>{
  //      if(result && result.length>0){
  //        //console.log('result--->',result[0]);
  //        this.servicio = new Servicio();
  //        this.servicio.idservicio = (result[0]).idservicio;
  //        this.servicio.idEmpresa = (result[0]).idEmpresa;
  //        this.servicio.idConductor = (result[0]).idConductor;
  //        this.servicio.FechaDeRecogida = (result[0]).FechaDeRecogida;
  //        this.servicio.pasajero = (result[0]).pasajero;
  //        this.servicio.Origen = (result[0]).Origen;
  //        this.servicio.Destino  = (result[0]).Destino;
  //        this.servicio.TipoDeServicio  = (result[0]).TipoDeServicio;
  //        this.servicio.vuelo  = (result[0]).vuelo;
  //       // console.log('this.servicio--->',this.servicio); 
  //        this.getEmpresaC(this.servicio.idEmpresa);        
         
  //      }else{
  //        console.log('No hay datos en result--->',idSer);
  //      }   
  //    });
  //  } 
  // getPropietarioC(){
  //   this.sser.getPropietario().subscribe(result =>{
  //     for (const prop of result) {
  //       this.propietario = prop;
  //       this.tmr  = moment(this.servicio.FechaDeRecogida).add(+this.servicio.tiempoMedioServicio,'minutes').add(+this.propietario.tAjusteFinalTrayVTC,'minutes').format('LTS');
       
  //       this.arrendatarioNombre=this.propietario.nombre;
  //       this.arrendatarioCIF=this.propietario.cif;
  //       this.arrendatarioDIR=this.propietario.direccion;
       
  //       break;
  //    }
  //    this.getVehiculosC(this.conductor.idVehiculo);
  //  });
  // }
  // getEmpresaC(idEmpresa: string) {
  //   let empresas: Empresas[];
  //   const empres = {'id': idEmpresa};
  //   this.sempresas.getEmpresa(JSON.stringify(empres)).subscribe(result => {
  //     empresas = result;
  //     for (const emp of empresas){
  //         this.empresa = emp;
  //         this.getConductorC(this.servicio.idConductor);
  //         break;      
  //       }
  //   });

  // }
  // getConductorC(idConductor: string) {
  //   const conduct =  new ConductorPeticion();
  //   conduct.id = idConductor;
  //   this.scon.getConductores(conduct).subscribe(result => {
  //     const conductores = result;
  //     for (const con of conductores){
  //         this.conductor = con;
  //         this.getcompaniasC(this.conductor.idCompania);
  //         break;
  //     }
  //   });
  // }
  // getcompaniasC(idCompania: string) {
  //   const compa =  new CompaniaPeticion();
  //   compa.id = idCompania;
  //   this.scon.getCompanias(compa).subscribe(result => {
  //     const companias = result;
  //     for (const con of companias){
  //       this.compania = con;
  //           ////EXCEPCION TODO ELIMINAR/////////////////////////////////////////////////////////////////
  //           if(this.compania.id=="8"){
  //             this.arrendadorNombre=this.empresa.nombre;
  //             this.arrendadorCIF=this.empresa.cif;
  //             this.arrendadorDIR=this.empresa.direccion;
  //           }else{
  //             this.arrendadorNombre=this.compania.nombre;
  //             this.arrendadorCIF=this.compania.cif;
  //             this.arrendadorDIR=this.compania.direccion;
    
  //           }
  //           /////////////////////////////////////////////////////////////////////
  //     }
  //     this.getPropietarioC();

  //   });
  // }
  // getVehiculosC(idVehiculo:string){
  //   const vehiculo={'id':idVehiculo};
  //   this.scon.getVehiculos(JSON.stringify(vehiculo)).subscribe(result => {
  //     for (const prop of result) {
  //       this.vehiculo = prop;
  //       break;
  //    }
  //    this.downloadVTCC();
  //   });
  // }
  // downloadVTCC() {
  //   this.getPDF();
  //   this.pdfDocGenerator.download('Luxucar_vtc_' + this.servicio.idservicio + '.pdf');
  //   console.log('################################ reinicio #######################################'); 
  //   this.verVTCSer()

  // }
  ////////////////////////////////////////////////////////////////////////
  getcompanias(idCompania: string) {
    const compa =  new CompaniaPeticion();
    compa.id = idCompania;
    this.scon.getCompanias(compa).subscribe(result => {
      const companias = result;
      for (const con of companias){
        this.compania = con;
            ////EXCEPCION TODO ELIMINAR/////////////////////////////////////////////////////////////////
            if(this.compania.id=="8"){
              this.arrendadorNombre=this.empresa.nombre;
              this.arrendadorCIF=this.empresa.cif;
              this.arrendadorDIR=this.empresa.direccion;
            }else{
              this.arrendadorNombre=this.compania.nombre;
              this.arrendadorCIF=this.compania.cif;
              this.arrendadorDIR=this.compania.direccion;
    
            }
            /////////////////////////////////////////////////////////////////////
      }
    });
  }
  getPDF() {
    const lorem = '\n\n EXPONEN\n\n Que el contratante, por las necesidades de su servicio, ' +
    'requiere la contratacion de servicios de transporte de viajeros con sus equipajes ' +
    ' en vehiculos de alquiler con conductor\n. Que el transportista se dedica a la actividad ' +
    ' requerida por el contratante y cumple los requisitos ' +
    ' exigidos por este y esta dispuesto a prestar los que requiere.\n Por lo expuesto, ambas partes ' +
    'establecen el presente contrato de arrendamiento ' +
    ' de servicios de transporte con arreglo a las siguientes ESTIPULACIONES:\n' +
    ' PRIMERA.- El servicio a realizar por la empresa transportista se regira bajo las condiciones y, ' +
    'por lo dispuesto, en la hoja que se adjunta al presente contrato,' +
    ' donde se determinaran las condiciones establecidas en el Art 24 de la Orden FOM/36/2008.\n' +
    ' SEGUNDA.- El presente contrato se ha regulado de conformidad con lo dispuesto en la ley 16/87 ' +
    ' moificado por la ley 29/2003 DE ORDENACIÓN DEL TRANSPORTE TERRESTRE, en el real' +
    ' decreto 1225/72006.\n y la Orden Ministerial FOM 36/2008.' +
    ' y en prueba de ello se ha ormalizado el presente contrato, de conformidad con lo recogido en la hoja de peticion del servicio.';

    this.dd = {
      watermark: { text: 'Luxucar', color: 'blue', opacity: 0.1, bold: true, italics: false },
      info: {
        title: 'Luxucar_VTC_' + this.servicio.idservicio+'.pdf',
        author: 'luxucar',
        subject: 'Hoja de ruta ' + this.servicio.idservicio,
        keywords: 'keywords for document',
        },
      content: [
        {columns: [
          { text:[
            { text: [ 
                {text: 'HOJA DE RUTA.\n', fontSize: 18, alignment: 'center' },
                {text: '(ORDEN FOM/36/2008)\n\n', fontSize: 12, alignment: 'center'}
              ]
           },
          ]},
          { image: 'logo',width: 100, style: 'rightme' }
        ]},
        {canvas: [ {type: 'line', x1: 1, y1: 1, x2: 500, y2: 1, lineWidth: 1, lineCap: 'round'}]},
  
        { text: [ 
          { text: '\nARRENDADOR: ' , fontSize: 12, bold: true, alignment: 'left' },
          { text: this.arrendadorNombre + '\n', fontSize: 12, bold: false, alignment: 'left' }
        ]
      },
      { text: 'CIF: ' + this.arrendadorCIF + '\n\n', fontSize: 10, alignment: 'left' },

      {canvas: [ {type: 'line', x1: 1, y1: 1, x2: 500, y2: 1, lineWidth: 1, lineCap: 'round'}]},

      { text: [ 
         {text: '\nARRENDATARIO: ' , fontSize: 12, bold: true},
         {text: this.arrendatarioNombre + '\n' , fontSize: 12, bold: false}
        ]
      },
      {text: 'CIF: ' + this.arrendatarioCIF + '\n' , fontSize: 10, bold: true},
      {text: 'DIRECCIÓN: ' + this.arrendatarioDIR + '\n\n' , fontSize: 10, bold: true},
      {text: 'CONDUCTOR: ' + this.conductor.nombre + '   DNI:'+this.conductor.dni+'\n' , fontSize: 10, bold: true},
  
        {text: 'FECHA DE CELEBRACIÓN DE CONTRATO : ' + moment(this.servicio.FechaDeRecogida).format('LLL')
                                                     + '\n\n' , fontSize: 10, bold: true},
        {canvas: [ {type: 'line', x1: 1, y1: 1, x2: 500, y2: 1, lineWidth: 1, lineCap: 'round'}]},
        {text: ' '},
          {style: 'tableExample',
          table: {
            body: [
              ['Dia', 'Ser', 'Descripción', 'Hora', 'Matricula'],
              [{text: moment(this.servicio.FechaDeRecogida).format('L')},
                {text: this.servicio.idservicio},
                [
                  ' ',
                  {
                    table: {
                      body: [
                        ['CLIENTE:', this.servicio.pasajero],
                        ['LUGAR DE SALIDA:', this.servicio.Origen],
                        ['LUGAR DE LLEGADA:', this.servicio.Destino],
                        ['OBSERVACIONES:', {stack: [{ul: [
                                                          this.servicio.TipoDeServicio,
                                                          this.servicio.vuelo
                                                        ]
                                                  }]}
                        ],
                        ['Hora finalización estimada:',this.tmr]
                      ]
                    },
                  }
                ],
                {text: moment(this.servicio.FechaDeRecogida).format('LTS')},
                {text: this.vehiculo.matricula}
              ]
            ]
          }},
  
          {canvas: [ {type: 'line', x1: 5, y1: 1, x2: 500, y2: 5, lineWidth: 1, lineCap: 'round'}]},
          { text: '\nCONTRATO.\n', fontSize: 10, alignment: 'center' },
          { text: '(ORDEN FOM/36/2008)\n', fontSize: 10, alignment: 'center' },
          {canvas: [ {type: 'line', x1: 5, y1: 1, x2: 500, y2: 5, lineWidth: 1, lineCap: 'round'}]},
          { text: 'CONTRATO DE ARRENDAMIENTO DE VEHICULOS CON CONDUCTOR', fontSize: 10, bold: true, alignment: 'left' },
          { text: 'A ' + moment(this.servicio.FechaDeRecogida).format('LLL'), fontSize: 10,  alignment: 'left' },
          { text: '\nINTERVIENEN\n\n', fontSize: 10, bold: true, alignment: 'left' },
  
          { text: [ 
              { text: 'DE UNA PARTE ', fontSize: 10, alignment: 'left' },
              { text: this.arrendadorNombre, fontSize: 10,bold: true, alignment: 'left' }
            ]
          },
          {text: 'CIF: ' + this.arrendadorCIF + '\n' , fontSize: 10, bold: true},
          { text: 'CON DOMICILIO SOCIAL EN ' + this.arrendadorDIR + ' EN ADELANTE TRANSPORTISTA', fontSize: 10, alignment: 'left' },
  
          { text: [ 
              { text: '\nDE OTRA PARTE ', fontSize: 10, alignment: 'left' },
              { text: this.arrendatarioNombre, fontSize: 10, bold: true, alignment: 'left' }
            ]
          },
          { text: 'CON CIF ' + this.arrendatarioCIF, fontSize: 10, alignment: 'left' },
          { text: 'Y DOMICILIADA EN ' + this.arrendatarioDIR + ' EN ADELANTE EL CONTRATANTE.\n', fontSize: 10, alignment: 'left' },
          { text: lorem, fontSize: 10, bold: true }
      ],
      images: {
        logo: 'data:image/jpeg;base64, /9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEP' +
          'ERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4e' +
          'Hh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACEAOIDAREA' +
          'AhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQA' +
          'AAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3' +
          'ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWm' +
          'p6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEA' +
          'AwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSEx' +
          'BhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElK' +
          'U1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3' +
          'uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD7LoAK' +
          'ACgAoAKACgAoAhuru1tE33NxFCvq7gUAc9q3jvw7p0ZeS6LgfxABV/NiBQBy8nxZhvGMeg6Tcak+' +
          'cD7NDJc5/wC/a4H50AZmqax8VtURpdP07VNIhxkyMLKBVH/bfe36UAedeI08SSM39t/HTT9D9Vk8' +
          'ZRQP+Cwwr+hoA4TVtP8AB8jH+1v2nJpD/Fs1i7vP1B5oAwZ9D+C7H/SP2j9TLf7OmX0n15zQBGug' +
          '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' +
          'AKACgAoAKACgD//Z'
  
      },
      styles: {
        rightme:
        {   
            alignment: 'right'
        }
      }
    };
  
    this.pdfDocGenerator = pdfMake.createPdf(this.dd, 'Luxucar_vtc_' + this.servicio.idservicio);
    }
  }
  