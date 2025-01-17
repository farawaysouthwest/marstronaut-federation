import { useQuery, gql } from '@apollo/client';

const GET_PHOTO = gql`
query GetPhoto($roverName: String!, $earthDate: String!) {
  Apod {
    hdurl
  }
  Photolist(rover_name: $roverName, earth_date: $earthDate) {
    photos {
      img_src
    }
  }
}
`;
function NasaPhotoData(earthDate) {
  // More POC messiness, re-factor to use more generic name instead of earthDate
  const xkcdDate = earthDate.props;
  const { loading, error, data } = useQuery(GET_PHOTO, {
  // Would be cool to have the date determine which rover is returned
    variables: {earthDate: xkcdDate, roverName: 'curiosity'}
  });
  if (loading) return null;
  if (error) return `Error! ${error}`;
  /* Iterating through the data, this should be re-factored
      to be handled in gql server (e.g. limit the data that
      is being queried/returned) */
  const images = (data.Photolist.photos);
  const imageList = []
  images.forEach(e =>{imageList.push(e.img_src)})
  const finalImage = imageList.slice(0,1)
  return (
    <div style={{backgroundImage: data.Photolist.photos.length > 0 ? `url(${finalImage})` : `url(${data.Apod.hdurl})`,
                 backgroundSize: 'cover',
                 minWidth: '720px',
                 maxWidth: '100%',
                 minHeight: '1080px',
                 maxHeight: '100%'}}>
      <div style={{ fontFace:'Lobster, Garamond, Helvetica', 
                    fontSize:'xxx-large', fontWeight:'900', 
                    textShadow: '1px 1px #fff',
                    padding:'200px'}}>
        <p>{earthDate.text}</p>
      </div>
      <div style ={{fontSize:'medium', fontWeight:'450', textShadow:'1px 1px #fff', paddingLeft:'200px'}}>
        <p>Text courtesy <a href="https://xkcd.com/json.html">xkcd</a>, images courtesy <a href="https://api.nasa.gov">NASA</a>.</p>
      </div>
    </div>
  );
}

export default NasaPhotoData;