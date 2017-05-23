var Categorie=require('../models/categorie');
var Journal=require('../models/journal');
var mongoose=require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin@ds137891.mlab.com:37891/smart2');

var c1=new Categorie({
    name : 'Généraliste'

});
var c2=new Categorie({
    name : 'Economique'

});
var c3=   new Categorie({
    name : 'Culturel'

});
c1.save();
c2.save();
c3.save();
var j1=new Journal({
    lienFb : 'BusinessNewsOficiel',
    picture:'https://fb-s-b-a.akamaihd.net/h-ak-xfa1/v/t1.0-1/p50x50/315769_335870123197772_1624378926_n.jpg?oh=edf3359d60cf78cb4a751f401c2bb03b&oe=5980401E&__gda__=1498275129_d08ca14e3fedab0b721d4cca5ab96b47',
    _categorie:c2
});
var j2= new Journal({
    lienFb : 'babnet',
    picture:'https://fb-s-a-a.akamaihd.net/h-ak-xtf1/v/t1.0-1/p50x50/16708228_10154339570179632_1699121534412738359_n.jpg?oh=24f836fab8c8dfa2dc416141db8cc812&oe=5996E6F3&__gda__=1500931047_e4f1586955fc468648d810bebdf507ae',
    _categorie:c1
});
var j3=    new Journal({
    lienFb : 'wmc.img',
    picture:'https://fb-s-a-a.akamaihd.net/h-ak-xat1/v/t1.0-1/p50x50/15317869_1323709821007104_4723902700645948023_n.png?oh=f3f2108c43b7e62d3f023b3e8b955639&oe=59860E96&__gda__=1501288535_9cfcd03fa48e9ef0a4d2b7ba8d42499e',
    _categorie:c2
});
var j4=    new Journal({
    lienFb : 'tuniscopecom',
    picture:'https://fb-s-c-a.akamaihd.net/h-ak-xtp1/v/t1.0-1/p50x50/11083625_10152774640145988_50427525848343449_n.png?oh=23417559e9274146a1ad2f39961b6823&oe=59964EA5&__gda__=1501424228_b2b7c4ffee7789d6321f293efe8409dc',
    _categorie:c3
});
var j5=    new Journal({
    lienFb : 'Tunisie.Numerique',
    picture:'https://fb-s-d-a.akamaihd.net/h-ak-xpf1/v/t1.0-1/p50x50/941568_641591789241191_1555708466_n.jpg?oh=83bc42ad27d27d6bdbbf230e38d32fd6&oe=59823C36&__gda__=1501356699_57f2e722f73b8ab4893337091ee5bedd',
    _categorie:c1
});
var j6=    new Journal({
    lienFb : 'Investir.En.Tunisie',
    picture:'https://fb-s-a-a.akamaihd.net/h-ak-xat1/v/t1.0-1/p50x50/13102824_1095895510466621_4140619607273015950_n.png?oh=023ce14d9d67e70b58a93b080e99dded&oe=59842893&__gda__=1502050642_866ad6614852cfff6a04479e32a70b20',
    _categorie:c2
});
var j7= new Journal({
    lienFb : 'KapitalisInfo',
    picture:'https://fb-s-d-a.akamaihd.net/h-ak-xta1/v/t1.0-1/c15.0.50.50/p50x50/1798753_704263026272705_1053683954_n.jpg?oh=71bd4bef71b1f64345de95b461868f28&oe=598FF8EF&__gda__=1502876832_5fbb853be5551642b1e194d4a8de9bcf',
    _categorie:c2
});
j1.save();
j2.save();
j3.save();
j4.save();
j5.save();
j6.save();
j7.save();
c1._journal.push(j2,j5);
c2._journal.push(j1,j3,j6,j7);
c3._journal.push(j4);
mongoose.disconnect();