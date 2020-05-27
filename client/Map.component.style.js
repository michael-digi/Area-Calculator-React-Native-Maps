import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  steps: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  poly: {
    color: 'red'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 50,
    backgroundColor: 'transparent',
    marginBottom: 450,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(214, 39, 39, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    marginBottom: 350
  },
  stepContainer: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});