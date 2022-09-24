import styles from './TournamentList.module.css';

const TournamentList = ({ items, placeholder }) => {
    if (placeholder && items.length === 0) {
        return (
            <div className={styles.container}>
                <span className={styles.placeholder}>
                    {placeholder}
                </span>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {items.map(({ tournament, onClick }) => (
                <div key={tournament.url} className={styles.card} onClick={onClick}>
                    <span className={styles.name}>{tournament.name}</span>
                </div>
            ))}
        </div>
    );
};

export default TournamentList;
