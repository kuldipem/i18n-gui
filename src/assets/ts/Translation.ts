import Key from "./Key";

export default class Translation{
   
    private text:string;
    private lang: string;
    private key: Key;

    public constructor(lang:string, text:string){
        this.lang=lang;
        this.text=text;
    }

    public getLang():string{
        return this.lang;
    }

    public getText():string{
        return this.text;
    }

    public setText(text:string):Translation{
        this.text=text;
        return this;
    }

    public setKey(key:Key): Translation{
        this.key=key;
        return this;
    }

   
    public getKey(): Key {
        return this.key;
    }

    public getJson(): any {
        return {
            'lang': this.getLang(),
            'text': this.getText()
        };
    }
}