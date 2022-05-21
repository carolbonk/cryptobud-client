

const shareBtn = document.getElementById('share');

shareBtn.onClick = async (filesArray) => {
    if (navigator.canShare) {
        navigator.share({
            url: 'http://twitter.com',
            title: 'Share this content',    
        })  
    }    
}