const jquery = require('jquery');
const path = require('path');
const JSZip = require("jszip");
const FileSaver = require('file-saver');

import 'popper.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../less/style.less';

import Key from './Key';
import Translation from './Translation';

let keys: Key[] = new Array<Key>();
let translations: Translation[] = new Array<Translation>();
let activeKey: Key | undefined;

let supportLangs: string[] = new Array<string>();
supportLangs.push('en_US');
supportLangs.push('gu_IN');
supportLangs.push('hi_IN');

const addKeyBtn = jquery("#addKey"),
    addLangBtn = jquery("#addLang"),
    keysContainer = jquery("#keysContainer"),
    transContainer = jquery("#transContainer"),
    exportData = jquery("#exportData");

addKeyBtn.on("click", (e: Event) => {
    let keyId = prompt('Add a key');
    if (keyId && keyId.length > 0) {
        let key = new Key(keyId);
        supportLangs.forEach((lang) => {
            // passing key.id as default text
            let trans = new Translation(lang, key.getId());
            key.addTranslation(trans);
            translations.push(trans);
        });
        keys.push(key);
        buildKeysUI();
        return true;
    }
    alert('A key shouldn\'t be empty.');
    return false;
});


addLangBtn.on("click", (e: Event) => {
    let langId = prompt('Add a Language') || "";
    if (langId && langId != undefined && langId.length > 0) {
        keys.forEach((key) => {
            // passing key.id as default text
            let trans = new Translation(langId, key.getId());
            key.addTranslation(trans);
            translations.push(trans);
        });
        supportLangs.push(langId);
        buildTransUI();
        return true;
    }

    alert('A Language id shouldn\'t be empty.');
    return false;
});

exportData.on('click', (e: Event) => {
    
    let data: any[] = [];

    keys.forEach((key: Key, index: number) => {
        data.push(key.getJson());
    });

    jquery.ajax({
        url: '/api/export',
        data: { 'keys': JSON.stringify(data), 'langs': JSON.stringify(supportLangs) },
        type: 'POST',
        success: function(data: any){
            const zip = new JSZip();
            zip.loadAsync(data,{base64:true})
                .then(function (zip: any) {
                    zip.generateAsync({type:"blob"})
                    .then(function (blob: any) {
                        FileSaver.saveAs(blob, "hello.zip");
                    });
                    
                }, function (e: Event) {
                    
                });
        }
    });
});

const buildTransUI = () => {
    let elements = '<form>';
    supportLangs.forEach((lang) => {
        elements += `<div class="form-group">
            <label for="${lang}TextArea">${lang}</label>
            <textarea disabled class="form-control" id="${lang}TextArea" data-lang="${lang}"  rows="3"></textarea>
        </div>`;
    });
    elements += `</form>`;
    transContainer.html(elements);
};

const buildKeysUI = (cb?: any) => {
    let elements = '<ul class="list-group">';
    keys.forEach((key) => {
        elements += `<li class="list-group-item" data-key="${key.getId()}">
            ${key.getId()}
        </li>`;
    });
    elements += `</ul>`;
    keysContainer.html(elements);
    cb && cb();
};

const bindClickEvent = () => {
    jquery(keysContainer).on('click', 'li', (e: Event) => {
        const li = jquery(e.target);
        jquery(li).siblings().removeClass('active');
        jquery(li).addClass('active');
        const id = jquery(li).attr('data-key');
        activeKey = keys.find(key => key.getId() === id);
        bindKeyToLangs();
    });
}

const bindKeyToLangs = () => {
    if (activeKey) {
        jquery(transContainer).find('textarea').removeAttr('disabled');
        const trans = activeKey.getTranslation();
        const keyId = activeKey.getId();
        trans.forEach((trans: Translation) => {
            jquery(`textarea[data-lang='${trans.getLang()}']`).val(trans.getText());
        });
    } else {
        jquery(transContainer).find('textarea').attr('disabled', 'disabled').val('');
    }
}

const bindInputEvent = () => {
    jquery(transContainer).on('input', 'textarea', (e: Event) => {
        if (!activeKey) {
            return;
        }
        const textarea = jquery(e.target);
        const lang: string = jquery(textarea).attr('data-lang');
        const trans: Translation[] = activeKey.getTranslation();
        const wantToUpdateTran: Translation | undefined = trans.find(x => x.getLang() === lang);
        if (wantToUpdateTran) {
            wantToUpdateTran.setText(jquery(textarea).val());
        }
    });
}

const buildFakeData = () => {
    const fakeKeys: string[] = [
        'Hi',
        'Ok',
        'I am not fine',
        'Thank You !!'
    ];

    fakeKeys.forEach((keyId) => {
        let key = new Key(keyId);
        supportLangs.forEach((lang) => {
            let trans = new Translation(lang, key.getId());
            key.addTranslation(trans);
            translations.push(trans);
        });
        keys.push(key);
    });
    buildTransUI();
    buildKeysUI();
}

const init = () => {
    buildTransUI();
    buildKeysUI(() => {
        bindClickEvent();
        bindInputEvent();
    });
    buildFakeData();
}

init();