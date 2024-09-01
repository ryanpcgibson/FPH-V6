import DataTable from '../components/DataTable';

const ContentPage: React.FC = () => {

    return (
        <div>
            <h1>Data</h1>
            <DataTable tableName="families" query="id, name, *, family_users(users(*),member_type)" />
            <DataTable tableName="locations" query="id, name, *" />
            <DataTable tableName="pets" query="id, name, *" />
            <DataTable tableName="moments" query="*, pet_moments(pets(*)),photos(*) " />
        </div>
    );
};

export default ContentPage;