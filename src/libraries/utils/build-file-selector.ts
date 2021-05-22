
export default function buildFileSelector(isMultiple: boolean , acceptType: string = "image/*" , callback :(fileList:File[]) => void ){
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    
    if(isMultiple){
        fileSelector.setAttribute('multiple', 'multiple');
    }

    fileSelector.setAttribute('accept', acceptType);

    
    fileSelector.addEventListener("change" , async function fileDialogChanged (e: any){
        const fileList = e.path[0].files;

        await callback(fileList)
    });
    
    return fileSelector;
}