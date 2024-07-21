const Comission_Write = () => {
    return (
        <div>
            <h2>의뢰 작성</h2>
            <form>
                <input 
                type="text"
                placeholder="제목을 입력해 주세요"
                name='title'
                />
                <input 
                type="text"
                placeholder="내용을 입력해 주세요"
                name='body'
                />
                <button>등록</button>
            </form>
        </div>
    );
};

export default Comission_Write;
