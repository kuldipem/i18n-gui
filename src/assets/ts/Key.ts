import Translation from "./Translation";

export default class Key {
    private id: string;
    private translations: Translation[];

    public constructor(id: string) {
        this.id = id.replace(/[^a-zA-Z0-9]/g,'_');
        this.translations=new Array<Translation>();
    }

    public addTranslation(translation: Translation): Key {
        this.translations.push(translation);
        translation.setKey(this);
        return  this;
    }

    public getTranslation(): Translation[] {
        return  this.translations;
    }
    
    public getId():string{
        return this.id;
    }

    public getJson():any {
        let trans:any =[];
        
        this.translations.forEach((t:Translation)=>{
            trans.push(t.getJson());
        });

        return {
            'id': this.getId(),
            'translations': trans
        };
    }
}
