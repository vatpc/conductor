export class Global {
    public readonly SERVIDOR_URL: string = 'https://luxucar.es';//'https://golddriving.es';//

    public readonly ADM_SCRIPTS = "/scripts";
    public readonly CLI_SCRIPTS = "/scriptsCli";
    public readonly CON_SCRIPTS = "/scriptsCon";

    public readonly RECUPERAR_CONTRASENIA_URL: string = '/nuevaContasenia?tkn={';

    public readonly URL_AENA="http://www.aena.es/csee/Satellite/infovuelos/es/?nvuelo=";
    public readonly URL_GOOGLE="https://www.google.com/search?q=vuelo+";
    
    public readonly ESTADO_EN_PETICION: string = 'En petición';
    public readonly ESTADO_ASIGNADO: string = 'Asignado';
    public readonly ESTADO_EN_CAMINO: string = 'En camino';
    public readonly ESTADO_FINALIZADO: string = 'Finalizado';
    public readonly ESTADO_ANULADO: string = 'Anulado';
    public readonly ESTADO_ADMINISTRANDO: string = 'Administrando';
    public readonly ESTADO_EN_RUTA: string = 'En ruta';
    public readonly ESTADO_RESERVADO: string = 'Reservado';
    public readonly ESTADO_EN_POSICION: string = 'En posición';

    public readonly TIEMPO_ESPERA_NOTIFI_SEG: number = 60;
    public readonly TIEMPO_ESPERA_ALERTAS_SEG: number = 15;
    public readonly NUMERO_REPETICIONES_NOTIFI: number = 3;
    public readonly USER_ADMIN:string ="administrador@luxucar.es";
    public readonly USER_COND_EXE:string ="arzuralonso@gmail.com";
    public readonly USER_COOR:string ="COORDINADOR";

    public readonly DIRBASE_IMG: string = "/images/";
    public readonly DIRBASE_IMG_COND: string = "/imag_cond/";
    public readonly SERVIDOR_URL_IMG: string = this.SERVIDOR_URL+"/s_comun/p.php";
    public readonly COND_LOG_NAME="logo";


  }
  