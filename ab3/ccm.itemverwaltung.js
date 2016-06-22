


ccm.component({

    name:'itemverwaltung',

    config: {

        html:[ ccm.store,{local:'templet.json'}],
        key : 'itemtestverwaltungmitdatumundloeschen',
        store: [ccm.store,{url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'itemstore' }],
        style: [ccm.load,'style.css'],
        user: [ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js'],
        icons: [ ccm.load, 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'  ]
    },
    Instance: function(){

        var self=this;
        self.init =function(callback){
            self.store.onChange = function(){self.render();};

            callback();
        };


        self.render = function(callback){

            var element = ccm.helper.element( self );
            self.store.get( self.key, function ( dataset ) {

             if ( dataset === null )
                self.store.set( { key: self.key, items: [] }, proceed );
            else
                proceed( dataset );

            function proceed(dataset){
                element.html( ccm.helper.html( self.html.get( 'main' ) ) );
                var item_div= ccm.helper.find(self,'.items');
               // var item;

               //test
               var einhorndiv = ccm.helper.find(self,'.items');
               einhorndiv.append(ccm.helper.html(self.html.get('einhorn')));

               //test ende

                for(var i=0; i < dataset.items.length ; i++ ){
                     addItem(i);
                }//for ende


                item_div.append(ccm.helper.html(self.html.get('neuesItem'),{onsubmit: function(){

                    var value = ccm.helper.val( ccm.helper.find( self, '.neuesItem' ).val() ).trim();

                    var value2 = ccm.helper.val( ccm.helper.find( self, '.datumi' ).val() ).trim();

                    var datume =  self.getDate().trim();

                    console.log(datume);


                    if ( value === ''||value2==='' ){
                        console.log("value was null v1:"+value+"v2:"+value2);
                        return};


                    self.user.login( function () {

                    dataset.items.push( { datum: value2, user: self.user.data().key, text: value,  erstdatum: datume } );

                    self.store.set( dataset, function () { self.render(); } );

                    } );
                    return false;


                }}));

                jqu(0);
            if ( callback ) callback();

            function removeItem(index){

              self.user.login(function(){

                if(dataset.items[index].user===self.user.data().key){


                dataset.items.splice(index,1);
                self.store.set(dataset, function () { self.render();});

              }else{

                console.log("nicht richtig");
              }
              }
            );


            }

            function jqu(x){

              if((x%4)==0){
                //rechtsbewegung
              $('.bild').animate({
                left:'+='+80+'%',


              },10000);
            }else if((x%4)==1){
              $('.bild').animate({
                top:'+='+100+'%'

              },10000);

            }else if((x%4)==2){
              //linksbewegung
              $('.bild').animate({
                left:'-='+80+'%'

              },10000);

            }else{
              //top
              $('.bild').animate({
                top:'-='+100+'%'

              },10000);
            }


            x=x+1;

            setTimeout(function(){ jqu(x) },15000);

            }

            function upItem(index){
                if(index-1<0){
                    return;

                }

                console.log("dataset an der i stelle:"+index+"wert:"+dataset.items[index]);
                console.log("dataset an der i-1 stelle:"+index-1+"wert:"+dataset.items[index-1]);

                var tmp=dataset.items[index];

                dataset.items[index]=dataset.items[index-1];
                dataset.items[index-1]=tmp;

                console.log("dataset an der i stelle:"+index+"wert:"+dataset.items[index]);
                console.log("dataset an der i-1 stelle:"+index-1+"wert:"+dataset.items[index-1]);


                console.log(dataset.items[index-1]);
                self.store.set(dataset, function () { self.render();});

            }

            function addItem(i){
              var   item = dataset.items[i];
            console.log(item);
              if(item!==null){
              item_div.append( ccm.helper.html( self.html.get( 'item' ),{

                  datum: ccm.helper.val( item.datum ),
                  name:"Autor: "+ ccm.helper.val( item.user ),

                  text: ccm.helper.val( item.text ),
                  click:  function(){
                      removeItem(i);
                  },
                  erstdatum: ("Erstelldatum: "+ccm.helper.val(item.erstdatum)),
                  upclick: function () {
                    upItem(i);

                  }

              }))};

            }

            }

        });
    };

    self.getDate = function(){
    var date = new Date();
	var stunden = date.getHours();
	var minuten = date.getMinutes();
    var seconde = date.getSeconds();
	var tag = date.getDate();
	var monatDesJahres = date.getMonth();
	var jahr = date.getFullYear();
	var tagInWoche = date.getDay();
	var wochentag = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
	var monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

	var datum;
        console.log(datum);

    if(minuten<10){
         datum = wochentag[tagInWoche] + ", " + tag + ". " + monat[monatDesJahres] + " " + jahr + "<br>" + stunden+":0" + minuten ;

    }else{
          datum = wochentag[tagInWoche] + ", " + tag + ". " + monat[monatDesJahres] + " " + jahr + "<br>" + stunden+":" + minuten ;

    }

        return datum;
    };

    }
});
